from ...serializers import RouteSerializer
from ...models import Route
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg

# Routes PUT API
# Switch to a PATCH API, would need to investigate how to rewrite this
@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def route_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        route_object =  Route.routeTables.get(pk=id)
        route_object.name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["route"]["name"])
        route_object.description = reqBody["route"]["description"]
        route_object.save()
        route_serializer = RouteSerializer(route_object, many=False)
        data["route"] = route_serializer.data
        data["edit_success"] = 1
        data["message"] = "route updated successfully"
        return Response(data)
    except:
        data["edit_success"] = -1
        data["message"] = "route could not be updated"
        return Response(data, status = 400)