from ...models import School, Route, Student, User, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer, LocationSerializer
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ..general.general_tools import has_access_to_object
from .student_account import get_students_email, get_students_phone
from ..general import response_messages

# Students Detail GET API
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def students_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        student = Student.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "student")
    try:
        student_school = has_access_to_object(request.user, student.school_id)
    except: 
        return response_messages.PermissionDenied(data, "student")
    try:
        student_serializer = StudentSerializer(student, many=False)
        if student_serializer.data["route_id"] == None:
            route_id = 0
            route_name = ""
        else:
            route = Route.objects.get(pk=student_serializer.data["route_id"])
            route_serializer = RouteSerializer(route, many=False)
            route_id = route_serializer.data["id"]
            route_name = route_serializer.data["name"]
        in_range = student_serializer.data["in_range"]
        school = School.objects.get(pk=student_serializer.data["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        user = User.objects.get(pk=student_serializer.data["user_id"])
        user_serializer = UserSerializer(user,many=False)
        location = Location.objects.get(pk=user_serializer.data["location"])
        location_serializer = LocationSerializer(location, many=False)
        user_arr = {"id": student_serializer.data["user_id"], "first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "address": location_serializer.data["address"], "phone_number": user_serializer.data["phone_number"], "email": user_serializer.data["email"]}
        student_user = student.account 
        try:
            account_id = student_user.pk
        except:
            account_id = ''
        student_arr = {"student_school_id": student_serializer.data["student_school_id"], "first_name": student_serializer.data["first_name"], "last_name": student_serializer.data["last_name"], "email": get_students_email(student), "account_id": account_id, "phone_number": get_students_phone(student), "in_range": in_range}
        data["student"] = student_arr
        data["user"] = user_arr
        data["school"] = {'id' : student_serializer.data["school_id"], 'name' : school_serializer.data["name"]}
        data["route"] = {'id' : route_id, 'name' : route_name}
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "extracting student details")
