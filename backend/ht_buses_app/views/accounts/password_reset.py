from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response



@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def valid_email(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody['user']['email']
    try: 
        User.objects.get(email = email)
        data["message"] = "User email exists"
        data["success"] = True
        return Response(data)
    except: 
        data["message"] = "The email entered does not belong to a user"
        data["success"] = False
        return Response(data)