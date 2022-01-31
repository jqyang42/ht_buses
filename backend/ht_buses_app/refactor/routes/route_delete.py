from ...models import Route
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.core.exceptions import ValidationError
from rest_framework.response import Response

# Routes DELETE API
@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def route_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        route_object =  Route.routeTables.get(pk=id)
        route_object.delete()
        data["message"] = "route successfully deleted"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "Route could not be deleted"})