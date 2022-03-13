from ...models import User, School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response
from ...serializers import LocationSerializer, UserSerializer
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ..general.general_tools import get_object_for_user
from ..general import response_messages
from guardian.shortcuts import get_objects_for_user

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        uv_user = User.objects.get(pk=id)
    except: 
        return response_messages.DoesNotExist(data, "user")
    try:
        user = get_object_for_user(request.user, uv_user, "view_user")
    except:
        return response_messages.PermissionDenied(data, "user")
    try:
        user_serializer = UserSerializer(user, many=False)
        location_serializer = LocationSerializer(user.location, many=False)
        location_arr = location_serializer.data
        if user_serializer.data["role"] == 0:
            role = "General"
        else:
            role = User.role_choices[int(user_serializer.data["role"])-1][1]
        schools = get_objects_for_user(user,"view_school", School.objects.all())
        user_arr = {"first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "email": user_serializer.data["email"], "role": role,"role_id": user_serializer.data["role"] ,"is_parent": user_serializer.data["is_parent"], "phone_number": user_serializer.data["phone_number"],"location": location_arr, "managed_schools":[]}
        data["user"] = user_arr
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "extracting user details")


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_account(request):
    data = {}
    id = request.query_params["id"]
    try:
        uv_user = User.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "user")
    try:
        user = get_object_for_user(request.user, uv_user, "view_user")
    except:
        return response_messages.PermissionDenied(data, "user")
    try:
        user_serializer = UserSerializer(user, many=False)
        location_arr = {"address": user.location.address}
        user_arr = {"first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "email": user_serializer.data["email"], "role": User.role_choices[user_serializer.data["role"]-1][1], "location": location_arr}
        data["user"] = user_arr
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "extracting user details")
        