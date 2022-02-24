from rest_framework.authtoken.models import Token
from ...models import User
from django.contrib.auth import login
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny]) 
def user_login(request):
    info = {}
    reqBody = json.loads(request.body)
    email = reqBody['email']
    password = reqBody['password']
    try:
        user = User.objects.get(email=email)
    except BaseException as e:
        return Response({"message": "An account with this email does not exist.",  "token":'', "valid_login": False})
    if not check_password(password, user.password):
        return Response({"message": "Password was incorrect.",  "token":'', "valid_login": False})
    login(request._request, user,backend = 'ht_buses_app.authenticate.AuthenticationBackend')
    token = Token.objects.get_or_create(user=user)[0].key
    info["user_id"] = user.id
    info["is_staff"] = user.is_staff
    info["is_parent"] = user.is_parent
    info["email"] = user.email
    info["first_name"] = user.first_name
    info["last_name"] = user.last_name
    message = "User was logged in successfully"
    return Response({"info": info,"mesage":message, "token":token, "valid_login": True})