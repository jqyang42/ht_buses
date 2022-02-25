from ...models import Route
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

# Routes DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def route_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        route_object =  Route.objects.get(pk=id)
        route_object.delete()
        data["message"] = "route successfully deleted"
        data["success"] = True
        return Response(data)
    except BaseException as e:
        data["message"] = "route could not be deleted"
        data["success"] = False
        return Response(data, status = 400)