from lib2to3.pytree import Base
from ...models import Route, Student, User, School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response
from ...serializers import LocationSerializer, SchoolSerializer, StudentSerializer, RouteSerializer, UserSerializer

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdminUser])
def users_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        user = User.objects.get(pk=id)
        user_serializer = UserSerializer(user, many=False)
        location_serializer = LocationSerializer(user.location, many=False)
        location_arr = location_serializer.data
        if user_serializer.data["is_parent"] == True:
            students = Student.studentsTable.filter(user_id=user_serializer.data["id"])
            students_serializer = StudentSerializer(students, many=True)
            student_list = []
            for student in students_serializer.data:
                student_id = student["id"]
                student_school_id = student["student_school_id"]
                student_school = School.schoolsTable.get(pk=student["school_id"])
                student_first_name = student["first_name"]
                student_last_name = student["last_name"]
                if student["route_id"] == None:
                    route_arr = {"id": 0, "color_id": 0}
                else:
                    route_student = Route.routeTables.get(pk=student["route_id"])
                    route_serializer = RouteSerializer(route_student, many=False)
                    route_arr = {"id": student["route_id"], "name": route_serializer.data["name"], "color_id": route_serializer.data["color_id"], "in_range": student["in_range"]}
                student_list.append({'id' : student_id, 'student_school_id': student_school_id, 'first_name': student_first_name, 'last_name' : student_last_name, 'route' : route_arr, 'school': {'id': student_school.id, 'name': student_school.name}})
            user_arr = {"first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "email": user_serializer.data["email"], "is_staff": user_serializer.data["is_staff"], "is_parent": user_serializer.data["is_parent"], "location": location_arr, "students": student_list}
        else:
            user_arr = {"first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "email": user_serializer.data["email"], "is_staff": user_serializer.data["is_staff"], "is_parent": user_serializer.data["is_parent"], "location": location_arr, "students": []}
        data["user"] = user_arr
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "user does not exist"
        data["success"] = False
        return Response(data, status = 404)


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_account(request):
    data = {}
    id = request.query_params["id"]
    try:
        user = User.objects.get(pk=id)
        user_serializer = UserSerializer(user, many=False)
        location_arr = {"address": user.location.address}
        user_arr = {"first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "email": user_serializer.data["email"], "is_staff": user_serializer.data["is_staff"], "location": location_arr}
        data["user"] = user_arr
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "user does not exist"
        data["success"] = False
        return Response(data, status = 404)