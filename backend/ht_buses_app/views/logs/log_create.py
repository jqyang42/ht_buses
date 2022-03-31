from ...serializers import LogSerializer
from ...models import User, Route, Log
from rest_framework.response import Response
import json
from datetime import datetime, date, timezone
from ...role_permissions import IsAdmin, IsDriver
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from pytz import timezone

# Added IsAdmin so I can test on Postman so I don't have to switch to being a driver
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsDriver|IsAdmin]) 
def create_log(request):
    data = {}
    reqBody = json.loads(request.body)
    edt = timezone('US/Eastern')
    log_obj = Log.objects.create(
        bus_number = reqBody["bus_number"],
        date = datetime.now(edt).date(),
        start_time = datetime.now(edt).time(),
        user_id = User.objects.get(pk=reqBody["user_id"]),
        route_id = Route.objects.get(pk=reqBody["route_id"])
    )
    log_serializer = LogSerializer(log_obj, many=False)
    data["message"] = "log created successfully"
    data["log"] = log_serializer.data
    data["success"] = True
    return Response(data)