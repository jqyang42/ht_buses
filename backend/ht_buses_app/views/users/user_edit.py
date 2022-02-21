from ...serializers import LocationSerializer
from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg
from .user_address_update import update_student_stop

@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def user_edit(request):
    data = {}
    #try:
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        user_object = User.objects.get(pk=id)
        user_object.email = reqBody["user"]["email"]
        user_object.first_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["user"]["first_name"])
        user_object.last_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["user"]["last_name"])
        user_object.location.address = reqBody["user"]["location"]["address"]
        user_object.location.lat = reqBody["user"]["location"]["lat"]
        user_object.location.long = reqBody["user"]["location"]["long"]
        user_object.location.save()
        user_object.is_parent = reqBody["user"]["is_parent"]
        user_object.is_staff = reqBody["user"]["is_staff"]
        user_object.save()
        update_student_stop(id)
        data["message"] = "user information was successfully updated"
        data["success"] = True
        location_serializer = LocationSerializer(user_object.location, many=False)
        data["user"] = {'id' : id, 'first_name' : reqBody["user"]["first_name"], 'last_name' : reqBody["user"]["last_name"], 'email' : reqBody["user"]["email"], 'is_staff' : reqBody["user"]["is_staff"], 'is_parent' : reqBody["user"]["is_parent"], 'location' : location_serializer.data}
        return Response(data)
    except:
        data["message"] = "user information could not be updated"
        data["success"] = False
        return Response(data, status = 404)

@csrf_exempt
@api_view(["PUT"])
@permission_classes([AllowAny])
def valid_email_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    email = reqBody["user"]['email']
    try: 
        user = User.objects.get(email = email)
        if int(user.id) != int(id):
            data["message"] = "Please enter a different email. A user with this email already exists"
            data["success"] = False
            return Response(data)
        else: 
            data["message"] = "The email entered is valid"
            data["success"] = True
            return Response(data)
    except: 
        data["message"] = "The email entered is valid"
        data["success"] = True
        return Response(data)