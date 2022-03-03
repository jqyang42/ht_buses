from ...models import Stop, Location, Route
from ...serializers import StopSerializer, LocationSerializer, RouteSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ...role_permissions import IsAdmin

# Stops GET API
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin]) 
def stops_view(request):
    data = {}
    id = request.query_params["id"] # this is route id
    try:
        route = Route.objects.get(pk=id)
        route_serializer = RouteSerializer(route, many=False)
        stops = Stop.objects.filter(route_id=route)
        stops_serializer = StopSerializer(stops, many=True)
        stops_arr = []
        for stop in stops_serializer.data:
            id = stop["id"]
            name = stop["name"]
            arrival = stop["arrival"]
            departure = stop["departure"]
            order_by = stop["order_by"]
            location = Location.objects.get(pk=stop["location_id"])
            location_serializer = LocationSerializer(location, many=False)
            stops_arr.append({"id": id, "name": name, "arrival": arrival[:-3], "departure": departure[:-3], "location": location_serializer.data, "order_by": order_by})
        data["stops"] = stops_arr
        data["route"] = {"id": id, "is_complete": route_serializer.data["is_complete"]}
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "route is not valid"
        data["success"] = False
        return Response(data, status=404)