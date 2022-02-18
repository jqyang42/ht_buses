from ...models import Stop, Route
from ...serializers import StopSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from datetime import datetime

# Stops POST API
@csrf_exempt
@api_view(["PUT"])
@permission_classes([AllowAny]) 
def stops_edit(request):
    data = {}
    try:
        reqBody = json.loads(request.body)
        count = 1
        stops = []
        for stop in reqBody["stops"]:
            stop_obj = Stop.stopTables.get(pk=stop["id"])
            print(stop_obj)
            route = Route.routeTables.get(pk=stop["route_id"])
            stop_obj.route_id = route
            if stop["name"] == "" or stop["name"] == None:
                stop_obj.name = "Stop " + str(count)
            else:
                stop_obj.name = stop["name"]
            stop_obj.order_by = count
            arrival = stop["arrival"]
            stop_obj.arrival = datetime.time(datetime.strptime(arrival,"%H:%M"))
            departure = stop["departure"]
            stop_obj.departure = datetime.time(datetime.strptime(departure, "%H:%M"))
            stop_obj.location_id.address = ""
            stop_obj.location_id.lat = stop["lat"]
            stop_obj.location_id.long = stop["long"]
            stop_obj.save()
            stop_serializer = StopSerializer(stop_obj, many=False)
            stops.append(stop_serializer.data)
            count += 1
        data["message"] = "stops edited successfully"
        data["success"] = True
        data["stops"] = stops
        return Response(data)
    except:
        data["message"] = "stops could not be edited"
        data["success"] = False
        return Response(data, status=400)


