from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ....models import School, Location
from django.core.paginator import Paginator
from ....serializers import SchoolSerializer, LocationSerializer
from django.contrib.postgres.search import SearchVector

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def school_sort(request):
    order_by = request.query_params["order_by"] # Name, Route, School, Bus Stop, Parent Name
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    page_num = request.query_params["page"]
    search = request.query_params["q"]
    # alphabetical sort
    if sort_by == "name" or sort_by == "address":
        data = alphabetical_sort(order_by, sort_by, page_num, search)
    
    # numerical sort
    if sort_by == "arrival" or sort_by == "departure":
        data = numerical_sort(sort_by, order_by, page_num, search)

    return Response(data)

def alphabetical_sort(order_by, sort_by, page_number, search):
    data = {}
    if sort_by == "name":
        if order_by == "asc":
            if search != None:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("name")
            else:
                schools = School.schoolsTable.all().order_by("name")
        else:
            if search != None:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("-name")
            else:
                schools = School.schoolsTable.all().order_by("-name")
    if sort_by == "address":
        if order_by == "asc":
            if search != None:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("location_id__address")
            else:
                schools = School.schoolsTable.all().order_by("location_id__address")
        else:
            if search != None:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("-location_id__address")
            else:
                schools = School.schoolsTable.all().order_by("-location_id__address")
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
        location = Location.locationTables.get(pk=school["location_id"])
        location_serializer = LocationSerializer(location, many=False)
        schools_arr.append({"id": id, "name": name, "arrival": arrival[:-3], "departure": departure[:-3], "location": location_serializer.data})
    data["schools"] = schools_arr
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data

def numerical_sort(sort_by, order_by, page_number, search):
    data = {}
    if sort_by == "arrival":
        if order_by == "asc":
            if search != None:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("arrival")
            else:
                schools = School.schoolsTable.all().order_by("arrival")
        else:
            if search != None:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("-arrival")
            else:
                schools = School.schoolsTable.all().order_by("-arrival")
    if sort_by == "departure":
        if order_by == "asc":
            if search != None:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("departure")
            else:
                schools = School.schoolsTable.all().order_by("departure")
        else:
            if search != None:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("-departure")
            else:
                schools = School.schoolsTable.filter(name__icontains=search).order_by("-departure")
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
            location = Location.locationTables.get(pk=school["location_id"])
            location_serializer = LocationSerializer(location, many=False)
            schools_arr.append({"id": id, "name": name, "arrival": arrival[:-3], "departure": departure[:-3], "location": location_serializer.data})
        data["schools"] = schools_arr
        data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
        data["success"] = True
        return data