from ...models import Route, School, Student
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer

@api_view(["GET"])
@permission_classes([IsAdminUser])
def routes_detail(request):
    data = {}
    id = request.query_params["id"]
    route = Route.routeTables.get(pk=id)
    route_serializer = RouteSerializer(route, many=False)
    school = School.schoolsTable.get(pk=route_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    students = Student.studentsTable.filter(route_id=id)
    students_serializer = StudentSerializer(students, many=True)
    data["name"] = route_serializer.data["name"]
    data["school"] = {'id' : route_serializer.data["school_id"], 'name' : school_serializer.data["name"]}
    data["description"] = route_serializer.data["description"]
    student_list = []
    for student in students_serializer.data:
        student_id = student["id"]
        student_school_id = student["student_school_id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        student_list.append({'id' : student_id, 'student_school_id': student_school_id, 'first_name': first_name, 'last_name' : last_name})
    if len(student_list) != 0:
        data["students"] = student_list
    return Response(data)