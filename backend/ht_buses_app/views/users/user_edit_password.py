from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import json
from rest_framework.response import Response
from ..general.general_tools import get_object_for_user
from ..general import response_messages

@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAuthenticated]) 
def user_password_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        user = User.objects.get(pk = id)
    except:
        return response_messages.DoesNotExist(data, "user")
    if request.user != user:
        return response_messages.PermissionDenied(data, "user")
    try:
        user.set_password(reqBody['user']['password'])
        user.save()
        data["message"] = "user password updated successfully"
        data["success"] = True
        return Response(data) 
    except:
        return response_messages.UnsuccessfulChange(data, "user password")