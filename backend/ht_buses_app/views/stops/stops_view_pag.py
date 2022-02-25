from ...models import Stop, Location, Route
from ...serializers import StopSerializer, LocationSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from django.core.paginator import Paginator

# Stops GET API
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdminUser]) 
def stops_view(request):
    data = {}
    id = request.query_params["id"] # this is route id
    try:
        route = Route.routeTables.get(pk=id)
        page_number = request.query_params["page"]
        if int(page_number) == 0:
            prev_page = False
            next_page = False
            total_page_num = 0
            stops = Stop.stopTables.filter(route_id=route).order_by("order_by")
            stops_serializer = StopSerializer(stops, many=True)
        else:
            stops = Stop.stopTables.filter(route_id=route).order_by("order_by")
            paginator = Paginator(stops, 10) # Show 10 per page
            stops_per_page = paginator.get_page(page_number)
            total_page_num = paginator.num_pages
            stops_serializer = StopSerializer(stops_per_page, many=True)
            if int(page_number) == 1 and int(page_number) == total_page_num:
                prev_page = False
                next_page = False
            elif int(page_number) == 1:
                prev_page = False
                next_page = True
            else:
                prev_page = True
                if int(page_number) == total_page_num:
                    next_page = False
                else:
                    next_page = True
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
        data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "route is not valid"
        data["success"] = False
        return Response(data, status=404)