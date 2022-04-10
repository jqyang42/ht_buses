from ...serializers import BusSerializer, LogSerializer
from ...models import User, Route, Log, Bus, Location
from rest_framework.response import Response
import json
from datetime import datetime, date, timezone, timedelta
from ...role_permissions import IsAdmin, IsDriver
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from pytz import timezone
from ht_buses_app.views.buses import transit_updates
from ht_buses_app.views.buses import bus_management
from .log_update import update_log_status

# Added IsAdmin so I can test on Postman so I don't have to switch to being a driver
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsDriver|IsAdmin]) 
def create_log(request):
    # TODO: needs to have API error checks if not a driver
    data = {}
    reqBody = json.loads(request.body)
    edt = timezone('US/Eastern') 
    if Log.objects.filter(user_id = request.user, duration = timedelta(hours=0)).exists():
        active_run = Log.objects.filter(user_id = request.user, duration = timedelta(hours=0))[0]
        update_log_status(active_run.pk)
    log_obj = Log.objects.create(
        bus_number = reqBody["log"]["bus_number"],
        date = datetime.now(edt).date(),
        start_time = datetime.now(edt).time(),
        user_id = User.objects.get(pk=reqBody["log"]["user_id"]),
        route_id = Route.objects.get(pk=reqBody["log"]["route_id"]),
        pickup = reqBody["log"]["pickup"]
    )
    bus_number = int(reqBody["log"]["bus_number"])
    bus_update(bus_number)
    log_serializer = LogSerializer(log_obj, many=False)
    data["message"] = "log created successfully"
    data["log"] = log_serializer.data
    data["success"] = True
    return Response(data)

def bus_update(bus_number):
    bus_obj = Bus.objects.filter(bus_number=bus_number)
    edt = timezone('US/Eastern')
    if bus_obj is None or len(bus_obj) == 0:
        bus_new = Bus.objects.create(
            bus_number = bus_number,
            last_updated = datetime.now(edt),
            is_running = True,
            location_id = Location.objects.create(
                address = "",
                lat = 0,
                lng = 0
            )
        )
        if not transit_updates.is_running:
            active_buses = bus_management.active_buses()
            transit_updates.initialize_updater(active_buses=active_buses)
        else:
            transit_updates.add_bus(bus_number)
    else:
        bus_serializer = BusSerializer(bus_obj[0], many=False)
        bus = Bus.objects.get(pk=bus_serializer.data["id"])
        bus.is_running = True
        bus.save()
        if not transit_updates.is_running:
            active_buses = bus_management.active_buses()
            transit_updates.initialize_updater(active_buses=active_buses)
        else:
            transit_updates.add_bus(bus.bus_number)