from ...serializers import LocationSerializer
from ...models import User
from ...groups import admin_group, bus_driver_group
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
from ..general.general_tools import assign_school_staff_perms
from ..general import response_messages
from guardian.shortcuts import assign_perm

@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def user_edit(request):
    data = {}
    reqBody = json.loads(request.body)
    print(reqBody)
    schools=reqBody["user"]["managed_schools"]
    print([sublists.get('key') for sublists in schools])
    try:
        id = request.query_params["id"]
        reqBody = json.loads(request.body)
        print(reqBody)
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
        user_object.location.save()
        user_object.is_parent = reqBody["user"]["is_parent"]
        """
        if User.role_choices[0][1] == reqBody["user"]["role"]:
            user_object.role = User.ADMIN
        if User.role_choices[1][1] == reqBody["user"]["role"]:
            user_object.role = User.DRIVER
        if User.role_choices[2][1] == reqBody["user"]["role"]:
            user_object.role = User.SCHOOL_STAFF
        """
        if reqBody["user"]["role_id"] == None or reqBody["user"]["role_id"] > 4 or reqBody["user"]["role_id"] < 0:
            user_object.role = 4
        else:
            user_object.role = reqBody["user"]["role_id"]
        user_object.save()
        
        reassign_perms(user=user, school_ids = reqBody["user"]["managed_schools"])
        assign_perm("change_user", user_object, user_object)
        assign_perm("view_user", user_object, user_object)
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

def reassign_perms(user, school_ids=[]):
    user.user_permissions.clear()
    user.save()
    if user.role == User.SCHOOL_STAFF:
        schools = School.objects.filter(pk__in=school_ids)
        print(schools)
        assign_school_staff_perms(user, schools) #TODO: change to take in schools 
    reassign_groups(user)
    assign_perm("change_user", user, user)
    assign_perm("view_user", user, user)
    user.save()
    return True 

def reassign_groups(user):
    user.groups.clear()
    user.save()
    if user.role == User.ADMIN:
        user.groups.add(admin_group)
    elif user.role == User.DRIVER:
        user.groups.add(bus_driver_group)
    user.save()
    return True
