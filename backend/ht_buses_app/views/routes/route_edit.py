from pickle import TRUE
from ...serializers import RouteSerializer
from ...models import Route
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import has_access_to_object
from ..general import response_messages


# Routes PUT API
# Switch to a PATCH API, would need to investigate how to rewrite this
@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def route_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        route_object =  Route.objects.get(pk=id)
    except:
        data["edit_success"] = -1
        return response_messages.DoesNotExist(data, "route")
    try:
        accessible_school = has_access_to_object(request.user, route_object.school_id)
    except:
        data["edit_success"] = -1
        return response_messages.PermissionDenied(data, "route's school")
    try:
        route_object.name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["route"]["name"])
        route_object.description = reqBody["route"]["description"]
        route_object.save()
        data["message"] = "route updated successfully"
        data["success"] = True
        data["edit_success"] = 1
        route_serializer = RouteSerializer(route_object, many=False)
        data["route"] = route_serializer.data
        return Response(data)
    except:
        data["edit_success"] = -1
        return response_messages.UnsuccessfulChange(data, "route")