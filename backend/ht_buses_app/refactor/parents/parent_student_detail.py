from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def parent_student_detail(request):
    data = {}
    id = request.query_params["id"]
    student = Student.studentsTable.get(pk=id)
    student_serializer = StudentSerializer(student, many=False)
    data["school_student_id"] = student_serializer.data["student_school_id"]
    data["first_name"] = student_serializer.data["first_name"]
    data["last_name"] = student_serializer.data["last_name"]
    school = School.schoolsTable.get(pk=student_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    data["school_name"] = school_serializer.data["name"]
    if ["route_id"] == None:
        route_name = "Unassigned"
        route_description = ""
    else:
        route = Route.routeTables.get(pk=student_serializer.data["route_id"])
        route_serializer = RouteSerializer(route, many=False)
        route_name = route_serializer.data["name"]
        route_description = route_serializer.data["description"]
    data["route"] = {'name' : route_name, 'description' : route_description}
    return Response(data)