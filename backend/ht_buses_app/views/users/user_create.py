from ...serializers import UserSerializer
from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from ..students import student_create
from ..accounts import account_setup
import re
from ..resources import capitalize_reg

# User POST API
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser])
def user_create(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody["user"]['email']
    password = reqBody["user"]['password']
    first_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["user"]['first_name'])
    last_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["user"]['last_name'])
    address = reqBody["user"]["location"]['address']
    is_staff = reqBody["user"]['is_staff']
    is_parent = reqBody["user"]['is_parent']
    lat = reqBody["user"]["location"]['lat']
    longitude = reqBody["user"]["location"]['long']
    if is_staff: 
        user = User.objects.create_superuser(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, password=password, address=address, lat=lat, long=longitude)
    else:
        user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, address= address, password=password, lat=lat, long=longitude)
    account_setup.account_setup_email(user)
    if is_parent:
        for student in reqBody["user"]["students"]:
            student_create.create_student(student, user.id)
    data["message"] = "user created successfully"
    user_serializer = UserSerializer(user, many=False)
    data["user"] = user_serializer.data
    data["success"] = True
    return Response(data)




