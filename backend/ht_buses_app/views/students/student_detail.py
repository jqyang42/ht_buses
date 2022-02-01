from ...models import School, Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer

# Students Detail GET API
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdminUser]) 
def students_detail(request):
    data = {}
    id = request.query_params["id"]
    student = Student.studentsTable.get(pk=id)
    student_serializer = StudentSerializer(student, many=False)
    if student_serializer.data["route_id"] == None:
        route_id = 0
        route_name = "Unassigned"
    else:
        route = Route.routeTables.get(pk=student_serializer.data["route_id"])
        route_serializer = RouteSerializer(route, many=False)
        route_id = route_serializer.data["id"]
        route_name = route_serializer.data["name"]
    school = School.schoolsTable.get(pk=student_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    data["user_id"] = student_serializer.data["user_id"]
    data["student_school_id"] = student_serializer.data["student_school_id"]
    data["first_name"] = student_serializer.data["first_name"]
    data["last_name"] = student_serializer.data["last_name"]
    data["school"] = {'id' : student_serializer.data["school_id"], 'name' : school_serializer.data["name"]}
    data["route"] = {'id' : route_id, 'name' : route_name}
    return Response(data)