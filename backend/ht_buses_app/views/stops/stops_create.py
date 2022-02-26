from ...models import Stop, Location, Route
from ...serializers import StopSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from datetime import datetime
from ..routes import route_check_is_complete
from .check_in_range import update_students_in_range

# Stops POST API
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser]) 
def stops_create(request):
    data = {}
    try:
        reqBody = json.loads(request.body)
        stops = []
        for stop in reqBody["stops"]:
            route = Route.objects.get(pk=stop["route_id"])
            route_stops = Stop.objects.filter(route_id=route)
            route_stops_serializer = StopSerializer(route_stops, many=True)
            if len(route_stops_serializer.data) == 0:
                count = 1
            else:
                count = route_stops_serializer.data[-1]["order_by"] + 1
            if stop["name"] == "" or stop["name"] == None:
                name = "Stop "+ str(count)
            else:
                name = stop["name"]
            order_by = count
            arrival = stop["arrival"]
            departure = stop["departure"]
            location = Location.objects.create(address="", lat=stop["lat"], lng=stop["lng"])
            stop_obj = Stop.objects.create(route_id=route, location_id=location, arrival=datetime.time(datetime.strptime(arrival,"%H:%M")), departure=datetime.time(datetime.strptime(departure, "%H:%M")), name=name, order_by=order_by)
            stop_serializer = StopSerializer(stop_obj, many=False)
            stops.append(stop_serializer.data)
            count += 1
            update_students_in_range(stop["route_id"])
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


