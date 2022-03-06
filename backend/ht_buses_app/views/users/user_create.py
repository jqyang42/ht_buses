from ...serializers import UserSerializer
from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from ..students import student_create
from ..accounts import activate_account
import re
from ..resources import capitalize_reg
from ..accounts import account_tools
from ...role_permissions import IsAdmin, IsSchoolStaff


# User POST API
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff])
def user_create(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody["user"]['email']
    first_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["user"]['first_name'])
    last_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["user"]['last_name'])
    address = reqBody["user"]["location"]['address']
    role = reqBody["user"]['role']
    is_parent = reqBody["user"]['is_parent']
    lat = reqBody["user"]["location"]['lat']
    lng = reqBody["user"]["location"]['lng']
    phone_number = reqBody["user"]["phone_number"]
    password = "fec6password" #account_tools.generate_random_password()
    if role == 1: 
        user = User.objects.create_superuser(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, password=password, address=address, lat=lat, lng=lng, phone_number = phone_number)
    else:
        user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, address= address, password=password, lat=lat, lng=lng, role=role, phone_number = phone_number)
    email_data = activate_account.send_account_activation_email(user)
    email_sent = email_data["success"]
    data["message"] = "user created successfully"
    if is_parent:
        try:
            for student in reqBody["user"]["students"]:
                student_create.create_student(student, user.id)
            data["message"] = "user and students created successfully"
        except:
            user.location.delete()
            user.delete()
            data["message"] = "user could not be created because student data was invalid"
            data["success"] = False
            return Response(data)
    if email_sent:
        data["message"] = data["message"] +  " and activation email sent to user"
    else:
        data["message"] = data["message"] + " but activation email could not be sent to user"
    user_serializer = UserSerializer(user, many=False)
    data["user"] = user_serializer.data
    data["success"] = True
    return Response(data)




