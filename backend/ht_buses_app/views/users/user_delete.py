from ...models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
  
@api_view(["POST"])
@permission_classes([IsAdminUser]) 
def user_delete(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        user_object =  User.objects.filter(first_name = reqBody['first_name'], last_name =reqBody['last_name'], email = reqBody['email'])
        user_object.delete()
        data["message"] = "user successfully deleted"
        result = {"data" : data}
        return Response(result)
    except:
        data["message"] = "User could not be deleted"
        result = {"data" : data}
        return Response(result) 