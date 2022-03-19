from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from .general_tools import user_is_parent


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def email_exists(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody['user']['email']
    try: 
        user = User.objects.get(email = email.lower())
        data["message"] = "User email exists"
        data["user_email_exists"] = True
        data["is_parent_email"] = user_is_parent(user)
        data["success"] = True
        return Response(data)
    except: 
        data["message"] = "The email entered does not belong to a user"
        data["user_email_exists"] = False
        data["success"] = False
        return Response(data)