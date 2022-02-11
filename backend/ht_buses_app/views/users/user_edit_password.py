from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import json
from rest_framework.response import Response

@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAuthenticated]) 
def user_password_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        user_object = User.objects.get(pk = id)
        user_object.set_password(reqBody['user']['password'])
        user_object.save()
        data["message"] = "user password updated successfully"
        data["success"] = True
        return Response(data) 
    except:
        data["message"] = "user's password could not be updated"
        data["success"] = False
        return Response(data, status = 400)   