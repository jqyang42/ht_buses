from ...serializers import LogSerializer, RouteSerializer, BusSerializer
from ...models import Route, Log, Bus
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...role_permissions import IsAdmin, IsDriver, IsSchoolStaff


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def user_transit(request):
    data = {}
    id = request.query_params["id"]
    logs = Log.objects.filter(user_id=id)
    log_serializer = LogSerializer(logs, many=True)
    log_arr = []
    for log in log_serializer.data:
        bus = Bus.objects.filter(bus_number=log["bus_number"])
        bus_serializer = BusSerializer(bus[0], many=False)
        if bus_serializer.data["is_running"] == True:
            bus_number = log["bus_number"]
            route = Route.objects.get(pk=log["route_id"])
            route_serializer = RouteSerializer(route, many=False)
            route_arr = {"id": log["route_id"], "name": route_serializer.data["name"]}
            log_arr.append({"bus_number": bus_number, "route": route_arr, "log_id": log["id"]})
    data = log_arr
    return Response(data)

