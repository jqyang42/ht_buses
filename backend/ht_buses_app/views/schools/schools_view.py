from ...models import School, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ...serializers import LocationSerializer, SchoolSerializer
from django.core.paginator import Paginator

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny]) 
def schools(request):
    data = {}
    page_number = request.query_params["page"]
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        schools = School.schoolsTable.all().order_by("id")
        school_serializer = SchoolSerializer(schools, many=True)
    else:
        schools = School.schoolsTable.all().order_by("id")
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
    schools = School.schoolsTable.all()
    school_serializer = SchoolSerializer(schools, many=True)
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
    return Response(data)