from ...models import Route, School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import json
from ...serializers import RouteSerializer
import re
from ..resources import capitalize_reg
from datetime import datetime

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser])
def route_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["route"]["name"])
    try:
        school = School.schoolsTable.filter(name = reqBody["route"]["school_name"])[0]
        description = reqBody["route"]["description"]
        is_complete = reqBody["route"]["is_complete"]
        route = Route.routeTables.create(name=name, school_id = school, description = description, is_complete=is_complete)
        route.color_id = route.id % 51
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