from ...serializers import StopSerializer
from ...models import Stop, Route
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from ...serializers import StopSerializer
from ..routes import route_check_is_complete

# Stops DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def stops_delete(request):
    data = {}
    try:
        reqBody = json.loads(request.body)
        stops = []
        for stop in reqBody["stops"]:
            stop_obj = Stop.stopTables.get(pk=stop["id"])
            stop_serializer = StopSerializer(stop_obj, many=False)
            route = Route.routeTables.get(pk=stop_serializer.data["route_id"])
            stop_obj.location_id.delete()
            stop_obj.delete()
            is_complete = route_check_is_complete.route_is_complete(stop["route_id"])
            route.is_complete = is_complete
            route.save()
        data["message"] = "stops deleted successfully"
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "stops could not be deleted"
        data["success"] = False
        return Response(data, status=400)


