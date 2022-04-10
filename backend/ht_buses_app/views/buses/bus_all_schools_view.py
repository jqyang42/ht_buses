from ...models import Bus, Location, Log, User, School, Route
from ...serializers import BusSerializer, LocationSerializer, LogSerializer, RouteSerializer, SchoolSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...role_permissions import IsAdmin, IsDriver, IsSchoolStaff
from ..general.general_tools import get_objects_for_user
from ..general.response_messages import PermissionDenied, DoesNotExist
from datetime import timedelta

# TODO: This method needs log permissions
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def get_buses(request):
    try:
        schools = get_objects_for_user(request.user,"view_school", School.objects.all())
    except:
        return PermissionDenied(data, "school")
    data = active_buses_filter(schools)
    if data["success"] == False:
        return Response(data, status=404)
    else: 
        return Response(data)

def active_buses_filter(schools):
    data = {}
    bus_arr = []
    school_arr = []
    school_count = 0
    avg_lat = 0
    avg_lng = 0
    buses = Bus.objects.filter(is_running=True)
    if len(buses) != 0:
        bus_serializer = BusSerializer(buses, many=True)
        for bus in bus_serializer.data:
            bus_number = bus["bus_number"]
            location_serializer = LocationSerializer(Location.objects.get(pk=bus["location_id"]), many=False)
            bus_lat = location_serializer.data["lat"]
            bus_lng = location_serializer.data["lng"]
            location_arr = {"id": location_serializer.data["id"], 'lat': bus_lat, 'lng': bus_lng}
            log_obj = Log.objects.filter(bus_number=bus_number, duration=timedelta(hours=0))
            if len(log_obj) != 0:
                log_obj_serializer = LogSerializer(log_obj[0], many=False)
                user_serializer = UserSerializer(User.objects.get(pk=log_obj_serializer.data["user_id"]), many=False)
                user_arr = {'id': log_obj_serializer.data["user_id"], "first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"]}
                bus_arr.append({'bus_number': bus_number, 'location': location_arr, 'user': user_arr})

    school_serializer = SchoolSerializer(schools, many=True)
    for school in school_serializer.data:
        school_location = Location.objects.get(pk=school["location_id"])
        school_location_serializer = LocationSerializer(school_location, many=False)
        school_location_arr = {'lat': school_location_serializer.data["lat"], 'lng': school_location_serializer.data["lng"]}
        school_arr.append({'id': school["id"], 'school': school["name"], 'location': school_location_arr})
        school_count += 1
        avg_lat += school_location_serializer.data["lat"]
        avg_lng += school_location_serializer.data["lng"]
    
    if len(schools) != 0:
        avg_lat = avg_lat / school_count
        avg_lng = avg_lng / schools_count
    data["buses"] = bus_arr
    data["schools"] = school_arr
    data["center"] = {'lat': avg_lat, 'lng': avg_lng}
    data["success"] = True
    return data
