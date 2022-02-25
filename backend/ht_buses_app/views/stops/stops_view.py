from ...models import Stop, Location, Route
from ...serializers import StopSerializer, LocationSerializer, RouteSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response

# Stops GET API
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdminUser]) 
def stops_view(request):
    data = {}
    id = request.query_params["id"] # this is route id
    try:
        route = Route.routeTables.get(pk=id)
        route_serializer = RouteSerializer(route, many=False)
        stops = Stop.stopTables.filter(route_id=route)
        # COMMENTED OUT CODE FOR PAGINATION
        # page_number = request.query_params["page"]
        # if int(page_number) == 1:
        #     stops = Stop.stopTables.all()[:10*int(page_number)]
        # else:
        #     stops = Stop.stopTable.all()[(1+10*(int(page_number)-1)):(10*int(page_number))]
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