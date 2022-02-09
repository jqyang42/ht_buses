from ...serializers import UserSerializer
from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
from ..students import student_create
import re
from ..resources import capitalize_reg

# User POST API
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser])
def user_create(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody['email']
    password = reqBody['password']
    first_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody['first_name'])
    last_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody['last_name'])
    address = reqBody['address']
    is_staff = reqBody['is_staff']
    is_parent = reqBody['is_parent']
    lat = reqBody['lat']
    longitude = reqBody['long']
    if is_staff: 
        user = User.objects.create_superuser(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, password=password, address=address, lat=lat, long=longitude)
    else:
        user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, address= address, password=password, lat=lat, long=longitude)
    if is_parent:
        for student in reqBody["students"]:
            student_create.create_student(student, user.id)
    data["message"] = "user created successfully"
    user_serializer = UserSerializer(user, many=False)
    data["user"] = user_serializer.data
    return Response(data)


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser]) #TODO : very that the email is valid when sumbit button pressed in user create forms
def valid_email_create(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody['email']
    try: 
        User.objects.get(email = email)
        data["message"] = "Please enter a different email. A user with this email already exists"
        data["validEmail"] = False
        return Response(data)
    except: 
        data["message"] = "The email entered is valid"
        data["validEmail"] = True
        return Response(data)

