from ...models import School, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ...serializers import LocationSerializer, SchoolSerializer

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def schools(request):
    data = {}
    schools = School.schoolsTable.all()
    # COMMENTED OUT CODE FOR PAGINATION
    # page_number = request.query_params["page"]
    # if int(page_number) == 1:
    #     schools = School.schoolsTable.all()[:10*int(page_number)]
    # else:
    #     schools = School.schoolsTable.all()[(1+10*(int(page_number)-1)):(10*int(page_number))]
    school_serializer = SchoolSerializer(schools, many=True)
    schools_arr = []
    for school in school_serializer.data:
        id = school["id"]
        name = school["name"]
        arrival = school["arrival"]
        departure = school["departure"]
        location = Location.locationTables.get(pk=school["location_id"])
        location_serializer = LocationSerializer(location, many=False)
        schools_arr.append({"id": id, "name": name, "arrival": arrival, "departure": departure, "location": location_serializer.data})
    data["schools"] = schools_arr
    data["success"] = True
    return Response(data)