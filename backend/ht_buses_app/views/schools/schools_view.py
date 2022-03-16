from ...models import School, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ...serializers import LocationSerializer, SchoolSerializer
from django.core.paginator import Paginator
from ...role_permissions import IsAdmin,IsSchoolStaff, IsDriver
from guardian.shortcuts import get_objects_for_user

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def schools(request):
    data = {}
    page_number = request.query_params["page"]
    order_by = request.query_params["order_by"] # TODO: double check, previously broken
    sort_by = request.query_params["sort_by"]
    search = request.query_params["q"]
    school_list = get_objects_for_user(request.user,"view_school", School.objects.all())
    data = get_schools_view(order_by, sort_by, page_number, search, school_list)
    return Response(data)

def get_schools_view(order_by, sort_by, page_number, search, school_list):
    data = {}
    schools = school_search_and_sort(sort_by, order_by, search, school_list)
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        school_serializer = SchoolSerializer(schools, many=True)
    else:
        paginator = Paginator(schools, 10) # Show 10 per page
        schools_per_page = paginator.get_page(page_number)
        total_page_num = paginator.num_pages
        school_serializer = SchoolSerializer(schools_per_page, many=True)
        if int(page_number) == 1 and int(page_number) == total_page_num:
            prev_page = False
            next_page = False
        elif int(page_number) == 1:
            prev_page = False
            next_page = True
        else:
            prev_page = True
            if int(page_number) == total_page_num:
                next_page = False
            else:
                next_page = True
    schools_arr = []
    for school in school_serializer.data:
        id = school["id"]
        name = school["name"]
        arrival = school["arrival"]
        departure = school["departure"]
        location = Location.objects.get(pk=school["location_id"])
        location_serializer = LocationSerializer(location, many=False)
        schools_arr.append({"id": id, "name": name, "arrival": arrival[:-3], "departure": departure[:-3], "location": location_serializer.data})
    data["schools"] = schools_arr
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data

def school_search_and_sort(sort_by, order_by, search, school_list):
    if sort_by == "address":
        sort_by = "location_id__address"
    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        schools = school_list.filter(name__icontains=search).order_by("id")
    else:
        if order_by == "asc":
            if search != None:
                schools = school_list.filter(name__icontains=search).order_by(sort_by)
            else:
                schools = school_list.all().order_by(sort_by)
        else:
            if search != None:
                schools = school_list.filter(name__icontains=search).order_by("-" + sort_by)
            else:
                schools = school_list.order_by("-" + sort_by)
    return schools
    