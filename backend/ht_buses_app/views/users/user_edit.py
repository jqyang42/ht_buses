from ...serializers import LocationSerializer
from ...models import User, School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg
from .user_address_update import update_student_stop
import traceback
from ...role_permissions import IsAdmin, IsSchoolStaff
from guardian.shortcuts import get_objects_for_user
from ..general.general_tools import get_object_for_user
from ..general.general_tools import assign_school_staff_perms, reassign_perms, reassign_groups
from ..general import response_messages
from guardian.shortcuts import assign_perm
from ...groups import get_admin_group, get_driver_group


@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def user_edit(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        id = request.query_params["id"]
        reqBody = json.loads(request.body)
        try:
            uv_user_object = User.objects.get(pk=id)
        except:
            return response_messages.DoesNotExist(data, "user")
        try:
            user_object = get_object_for_user(request.user, uv_user_object, "change_user")
        except:
            return response_messages.PermissionDenied(data, "user")
        user_object.email = reqBody["user"]["email"]
        user_object.first_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["user"]["first_name"])
        user_object.last_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["user"]["last_name"])
        user_object.location.address = reqBody["user"]["location"]["address"]
        user_object.location.lat = reqBody["user"]["location"]["lat"]
        user_object.location.lng = reqBody["user"]["location"]["lng"]
        user_object.phone_number = reqBody["user"]["phone_number"]
        #user_object.location.save()
        user_object.is_parent = reqBody["user"]["is_parent"]
        """
        if User.role_choices[0][1] == reqBody["user"]["role"]:
            user_object.role = User.ADMIN
        if User.role_choices[1][1] == reqBody["user"]["role"]:
            user_object.role = User.DRIVER
        if User.role_choices[2][1] == reqBody["user"]["role"]:
            user_object.role = User.SCHOOL_STAFF
        """
        user_object.save()
        if reqBody["user"]["role_id"] == None or reqBody["user"]["role_id"] > 4 or reqBody["user"]["role_id"] < 0:
            user_object.role = User.GENERAL
        else:
            user_object.role = reqBody["user"]["role_id"]
        if user_object.role == User.SCHOOL_STAFF:
            schools = reqBody["user"]["managed_schools"]
            reassign_success = reassign_perms(edited_user=user_object, schools = schools)
            if not reassign_success:
                return response_messages.UnsuccessfulAction(data, "user edit")
        user_object.save()
        update_student_stop(id)
        data["message"] = "user information was successfully updated"
        data["success"] = True
        location_serializer = LocationSerializer(user_object.location, many=False)
        data["user"] = {'id' : id, 'first_name' : reqBody["user"]["first_name"], 'last_name' : reqBody["user"]["last_name"], 'email' : reqBody["user"]["email"], 'role_id' : reqBody["user"]["role_id"], 'is_parent' : reqBody["user"]["is_parent"], 'phone_number': reqBody["user"]["phone_number"],'location' : location_serializer.data}
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "user edit")

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

