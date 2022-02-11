from ...models import User
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response

# Valid Access API
@csrf_exempt
@api_view(["POST"]) 
def validAccess(request):
    try:
        reqBody = json.loads(request.body)
        session_token = reqBody['token']
        id = reqBody['user_id']
        user_token = User.objects.get(pk = id).auth_token
        valid_token = user_token == session_token
        message = "The session token is valid"
        is_staff = User.objects.get(pk = id).is_staff 
        return Response({"mesage":message, "valid_token": True,"is_staff":is_staff})
    except:
        message = "Invalid token, user is not logged in"
        return Response({"mesage":message, "valid_token": False, "is_staff":False}, status = 401)