from ...models import School, Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import get_object_for_user
from ..general import response_messages

# Students Detail GET API
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def students_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        uv_student = Student.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "student")
    try:
        student = get_object_for_user(request.user, uv_student, "view_student")
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
        student_arr = {"user_id": student_serializer.data["user_id"], "student_school_id": student_serializer.data["student_school_id"], "first_name": student_serializer.data["first_name"], "last_name": student_serializer.data["last_name"], "in_range": in_range}
        data["student"] = student_arr
        data["school"] = {'id' : student_serializer.data["school_id"], 'name' : school_serializer.data["name"]}
        data["route"] = {'id' : route_id, 'name' : route_name}
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "extracting student details")
