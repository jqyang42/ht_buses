from ...models import Route
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from django.core.exceptions import ValidationError
from rest_framework.response import Response

# Routes PUT API
@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def route_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        route_object =  Route.routeTables.get(pk=id)
        route_object.name = reqBody['route_name']
        # route_object.school_id =  School.schoolsTable.filter(name = reqBody['school_name'])[0]
        route_object.description = reqBody['route_description']
        route_object.save()
        data["message"] = "route updated successfully"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "invalid options were chosen"})