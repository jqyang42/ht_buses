from ...models import Route, School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import json
from ...serializers import RouteSerializer
import re
from ..resources import capitalize_reg
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser])
def route_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody['route_name'])
    try:
        school = School.schoolsTable.filter(name = reqBody['school_name'])[0]
        description = reqBody['route_description']
        route = Route.routeTables.create(name=name, school_id = school, description = description)
        route_serializer = RouteSerializer(route, many=False)
        data["message"] = "route created successfully"
        data["route"] = route_serializer.data
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        return Response(data, status = 400)
        #raise ValidationError({"message": "route could not be created"})