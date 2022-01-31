from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
  
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def user_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        user_object =  User.objects.get(pk=id)
        user_object.delete()
        data["message"] = "user successfully deleted"
        result = {"data" : data}
        return Response(result)
    except:
        data["message"] = "User could not be deleted"
        result = {"data" : data}
        return Response(result) 