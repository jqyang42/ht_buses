from ...serializers import BusSerializer, LogSerializer
from ...models import User, Route, Log, Bus, Location
from rest_framework.response import Response
import json
from datetime import datetime, date, timezone
from ...role_permissions import IsAdmin, IsDriver
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from pytz import timezone

# Added IsAdmin so I can test on Postman so I don't have to switch to being a driver
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsDriver|IsAdmin]) 
def update_log(request):
    data = {}
    edt = timezone('US/Eastern')
    id = request.query_params["id"]
    log_obj = Log.objects.get(pk=id)
    log_serializer = LogSerializer(log_obj, many=False)
    time_end = datetime.now(edt)
    start_time = log_obj.start_time
    d_start_time = edt.localize(datetime.combine(log_obj.date, start_time))
    time_calc = time_end - d_start_time
    log_obj.duration = time_calc
    log_obj.save()
    # update bus
    bus_obj = Bus.objects.filter(bus_number=log_obj.bus_number)
    bus_serializer = BusSerializer(bus_obj[0], many=False)
    bus = Bus.objects.get(pk=bus_serializer.data["id"])
    bus.is_running = False
    bus.save()
    # Call Thomas method to remove bus and update bus is_running as false
    final_log_serializer = LogSerializer(log_obj, many=False)
    bus_serializer = BusSerializer(bus, many=False)
    print(bus_serializer.data)
    data["log"] = final_log_serializer.data
    data["success"] = True
    return Response(data)