from ...models import User, School, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from ...serializers import LocationSerializer, UserSerializer, ManageSchoolsSerializer
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ..general.general_tools import has_access_to_object, get_role_string, user_is_parent
from ..general import response_messages
from guardian.shortcuts import get_objects_for_user
from rest_framework.authtoken.models import Token
from ht_buses_app.views.buses import transit_updates
from ht_buses_app.views.buses import bus_management

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
    if request.user.id != int(id):
        try:
            user = has_access_to_object(request.user, uv_user)
        except:
            return response_messages.PermissionDenied(data, "user")
    else:
        user = User.objects.get(pk = request.user.pk)
    student_id = None
    if user.role == User.STUDENT:
        student_object = Student.objects.get(account = user)
        student_id = student_object.pk
    try:
        user_serializer = UserSerializer(user, many=False)
        location_serializer = LocationSerializer(user.location, many=False)
        location_arr = location_serializer.data
        if user_serializer.data["role"] == 0:
            role = "General"
        else:
            role = User.role_choices[int(user_serializer.data["role"])-1][1]
        schools = get_objects_for_user(user,"view_school", School.objects.all())
        manage_schools_serializer = ManageSchoolsSerializer(schools, many=True)
        user_arr = {"first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "email": user_serializer.data["email"], "role": role,"role_id": user_serializer.data["role"] ,"is_parent": user_is_parent(user), "phone_number": user_serializer.data["phone_number"],"location": location_arr, "managed_schools": manage_schools_serializer.data, "student_object_id": student_id}
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
    if request.user.id != int(id):
        try:
            user = has_access_to_object(request.user, uv_user)
        except:
            return response_messages.PermissionDenied(data, "user")
    else:
        user = User.objects.get(pk = request.user.pk)
    try:
        user_serializer = UserSerializer(user, many=False)
        location_arr = {"address": user.location.address}
        user_arr = {"first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "email": user_serializer.data["email"], "role": User.role_choices[user_serializer.data["role"]-1][1], "location": location_arr}
        data["user"] = user_arr
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "extracting user details")
        
@csrf_exempt
@api_view(["GET"])
@permission_classes([AllowAny])
def update_stored_user_info(request):
    data = {}
    if not transit_updates.is_running:
        active_buses = bus_management.active_buses()
        transit_updates.initialize_updater(active_buses=active_buses)

    try:
        user = request.user
        user = User.objects.get(pk = user.id)
    except:
        data["success"] = False 
        data["logged_in"] = False
        message = "User authentication details could not extracted, try logging in again"
        return Response({"data": data,"message": message, "token": ''}, status = 401)
    if not user.is_authenticated:
        data["success"] = False 
        data["logged_in"] = False
        message = "User authentication details could not extracted, try logging in again"
        return Response({"data": data, "message": message, "token": ''}, status = 401)
    try:
        token = Token.objects.get_or_create(user=user)[0].key
        data["user_id"] = user.id
        data["role_id"] = user.role
        data["role_value"] = get_role_string(user.role)
        # data["is_parent"] = user_is_parent(user.id)
        data["email"] = user.email
        data["first_name"] = user.first_name
        data["last_name"] = user.last_name
        data["success"] = True
        data["logged_in"] = user.is_authenticated
        message = "User authentication details are up-to-date"
        return Response({"data": data, "message": message, "token": token})
    except:
        data["success"] = False 
        data["logged_in"] = False
        message = "User authentication details could not extracted, try logging in again"
        return Response({"data": data, "message": message, "token": ''}, status = 401)
    