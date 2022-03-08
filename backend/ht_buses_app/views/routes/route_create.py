from ...models import Route, School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.parsers import json
from ...serializers import RouteSerializer
import re
from ..resources import capitalize_reg
from datetime import datetime
from ...role_permissions import IsAdmin

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin])
def route_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["route"]["name"])
    route_color_num = 51
    try:
        school = School.objects.get(pk=reqBody["route"]["school_id"])
        description = reqBody["route"]["description"]
        is_complete = reqBody["route"]["is_complete"]
        route = Route.objects.create(name=name, school_id = school, description = description, is_complete=is_complete)
        route.color_id = route.id % route_color_num
        route.save()
        route_serializer = RouteSerializer(route, many=False)
        data["message"] = "route created successfully"
        data["success"] = True
        data["route"] = route_serializer.data
        return Response(data)
    except BaseException as e:
        data["message"] = "route could not be created"
        data["success"] = False
        return Response(data, status = 400)
