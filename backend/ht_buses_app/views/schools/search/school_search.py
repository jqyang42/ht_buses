from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response
from ....models import School, Location
from django.core.paginator import Paginator
from ....serializers import StudentSerializer, LocationSerializer, SchoolSerializer
from django.contrib.postgres.search import SearchVector

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def school_search(request):
    data = {}
    # search by either id or name
    search_q = request.query_params["q"]
    page_number = request.query_params["page"]
<<<<<<< HEAD
    schools = School.objects.annotate(search=SearchVector("name")).filter(search__icontains=search_q)
=======
    schools = School.schoolsTable.filter(name__icontains=search_q)
>>>>>>> a685ed4ed2fc364920bb2f01e590caed72227d57
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
    return Response(data)