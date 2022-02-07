from ...serializers import RouteSerializer
from ...models import Route
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg

# Routes PUT API
# Switch to a PATCH API, would need to investigate how to rewrite this
@csrf_exempt
@api_view(["PUT"])
@permission_classes([AllowAny]) 
def route_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        route_object =  Route.routeTables.get(pk=id)
        route_object.name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["route"]["name"])
        route_object.description = reqBody["route"]["description"]
        route_object.save()
        data["message"] = "route updated successfully"
        route_serializer = RouteSerializer(route_object, many=False)
        data["route"] = route_serializer.data
        result = data
        return Response(result)
    except:
        data["message"] = "route could not be updated"
        return Response(data, status = 400)