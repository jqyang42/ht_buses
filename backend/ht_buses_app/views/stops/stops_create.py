from ...models import Stop, Location, Route
from ...serializers import StopSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from datetime import datetime
from ..routes import route_check_is_complete

# Stops POST API
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser]) 
def stops_create(request):
    data = {}
    try:
        reqBody = json.loads(request.body)
        count = 1
        stops = []
        for stop in reqBody["stops"]:
            route = Route.routeTables.get(pk=stop["route_id"])
            if stop["name"] == "" or stop["name"] == None:
                name = "Stop "+ str(count)
            else:
                name = stop["name"]
            order_by = count
            arrival = stop["arrival"]
            departure = stop["departure"]
            location = Location.locationTables.create(address="", lat=stop["lat"], long=stop["long"])
            stop_obj = Stop.stopTables.create(route_id=route, location_id=location, arrival=datetime.time(datetime.strptime(arrival,"%H:%M")), departure=datetime.time(datetime.strptime(departure, "%H:%M")), name=name, order_by=order_by)
            stop_serializer = StopSerializer(stop_obj, many=False)
            stops.append(stop_serializer.data)
            count += 1
            is_complete = route_check_is_complete.route_is_complete(stop["route_id"])
            route.is_complete = is_complete
            route.save()
        data["message"] = "stops created successfully"
        data["success"] = True
        data["stops"] = stops
        return Response(data)
    except:
        data["message"] = "stops could not be created"
        data["success"] = False
        return Response(data, status=400)


