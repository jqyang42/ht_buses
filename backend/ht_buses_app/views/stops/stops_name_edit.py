from ...models import Stop, Route
from ...serializers import StopSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from .check_in_range import update_students_in_range
from ..routes import route_check_is_complete

# Stops PUT API
@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def stops_name_edit(request):
    data = {}
    # try:
    reqBody = json.loads(request.body)
    count = 1
    stops = []
    for stop in reqBody["stops"]:
        stop_obj = Stop.stopTables.get(pk=stop["id"])
        if stop["name"] == "" or stop["name"] == None:
            stop_obj.name = "Stop " + str(stop_obj.order_by)
        else:
            stop_obj.name = stop["name"]
        stop_obj.location_id.lat = stop["location"]["lat"]
        stop_obj.location_id.long = stop["location"]["long"]
        stop_obj.location_id.save()
        stop_obj.save()
        stop_serializer = StopSerializer(stop_obj, many=False)
        stops.append(stop_serializer.data)
        count += 1
        update_students_in_range(stop_serializer.data["route_id"])
        route = Route.routeTables.get(pk=stop_serializer.data["route_id"])
        is_complete = route_check_is_complete.route_is_complete(stop_serializer.data["route_id"])
        route.is_complete = is_complete
        route.save()
    data["message"] = "stops edited successfully"
    data["success"] = True
    data["stops"] = stops
    return Response(data)