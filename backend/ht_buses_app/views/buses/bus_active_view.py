from ...models import Bus, Location, Log, User
from ...serializers import BusSerializer, LocationSerializer, LogSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...role_permissions import IsAdmin, IsDriver, IsSchoolStaff
from datetime import timedelta

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def get_buses(request):
    data = {}
    school_id = request.query_params["id"]
    data["buses"] = active_buses_filter(school_id)
    return Response(data)

def active_buses_filter(school_id):
    data = {}
    bus_arr = []
    if int(school_id) == 0:
        buses = Bus.objects.filter(is_running=True)
        bus_serializer = BusSerializer(buses, many=True)
        for bus in bus_serializer.data:
            bus_number = bus["bus_number"]
            location_serializer = LocationSerializer(Location.objects.get(pk=bus["location_id"]), many=False)
            bus_lat = location_serializer.data["lat"]
            bus_lng = location_serializer.data["lng"]
            location_arr = {"id": location_serializer.data["id"], 'lat': bus_lat, 'lng': bus_lng}
            log_obj = Log.objects.filter(bus_number=bus_number, duration=timedelta(hours=0))
            log_obj_serializer = LogSerializer(log_obj[0], many=False)
            user_serializer = UserSerializer(User.objects.get(pk=log_obj_serializer.data["user_id"]), many=False)
            user_arr = {'id': log_obj_serializer.data["user_id"], "first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"]}
            bus_arr.append({'bus_number': bus_number, 'location': location_arr, 'user': user_arr})
    else:
        # grab buses from school
        logs = Log.objects.filter(route_id__school_id=school_id, duration=timedelta(hours=0))
        log_serializer = LogSerializer(logs, many=True)
        for log in log_serializer.data:
            bus_number = log["bus_number"]
            bus_obj = Bus.objects.filter(bus_number=bus_number)
            bus_serializer_l = BusSerializer(bus_obj[0], many=False)
            location_serializer_l = LocationSerializer(Location.objects.get(pk=bus_serializer_l.data["location_id"]), many=False)
            bus_lat_l = location_serializer_l.data["lat"]
            bus_lng_l = location_serializer_l.data["lng"]
            location_arr = {"id": location_serializer_l.data["id"], 'lat': bus_lat_l, 'lng': bus_lng_l}
            user_serializer = UserSerializer(User.objects.get(pk=log["user_id"]), many=False)
            user_arr = {"id": log["user_id"], "first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"]}
            bus_arr.append({'bus_number': bus_number, 'location': location_arr, 'user': user_arr})
    data["buses"] = bus_arr
    return bus_arr
