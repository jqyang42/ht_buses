from ...serializers import BusSerializer, LogSerializer, UserSerializer
from ...models import Log, Bus, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ..general.general_tools import has_access_to_object
from datetime import timedelta

# Routes in Transit GET API
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def route_transit(request):
    data = {}
    id = request.query_params["id"]
    logs = Log.objects.filter(route_id=id, duration=timedelta(hours=0))
    log_serializer = LogSerializer(logs, many=True)
    log_arr = []
    for log in log_serializer.data:
        bus = Bus.objects.filter(bus_number=log["bus_number"])
        bus_serializer = BusSerializer(bus[0], many=False)
        if bus_serializer.data["is_running"] == True:
            bus_number = log["bus_number"]
            user = User.objects.get(pk=log["user_id"])
            user_serializer = UserSerializer(user, many=False)
            driver = {"id": log["user_id"], "first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"]}
            log_arr.append({"bus_number": bus_number, "user": driver, "log_id": log["id"]})
    data = log_arr
    return Response(data)