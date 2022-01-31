from ...models import User
from django.contrib.auth import logout
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response

# Logout API
@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def user_logout(request):
    try:
        reqBody = json.loads(request.body)
        user_id = User.objects.get(pk = reqBody["user_id"])
        user_id.auth_token.delete()
        logout(request._request)
        return Response({"message":'User was logged out successfully'})  
    except:
        return Response({"message":'Unsuccessful logout'}) 