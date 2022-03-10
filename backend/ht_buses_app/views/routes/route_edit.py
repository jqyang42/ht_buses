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
from ..general.general_tools import get_object_for_user

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
        data["message"] = "route could not be updated"
        data["success"] = False
        return Response(data, status = 400)
    try:
        accessible_school = get_object_for_user(request.user, route_object.school_id, "change_school")
        route_object.name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["route"]["name"])
        route_object.description = reqBody["route"]["description"]
        route_object.save()
        data["message"] = "route updated successfully"
        data["success"] = True
        route_serializer = RouteSerializer(route_object, many=False)
        data["route"] = route_serializer.data
        return Response(data)
    except:
        data["edit_success"] = -1
        data["message"] = "permission denied"
        data["success"] = False
        return Response(data, status = 403)