from ...models import Route
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from django.core.exceptions import ValidationError
from rest_framework.response import Response

# Routes PUT API
@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def route_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        route_object =  Route.routeTables.get(pk=id)
        route_object.name = reqBody['route_name'].capitalize()
        route_object.description = reqBody['route_description'].capitalize()
        route_object.save()
        data["message"] = "route updated successfully"
        result = {"data" : data}
        return Response(result)
    except:
        return Response(result, status = 400)
        #raise ValidationError({"messsage": "invalid options were chosen"})