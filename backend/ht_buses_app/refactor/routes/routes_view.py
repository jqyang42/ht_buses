from ...models import School, Route, Student
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer

# Routes GET API: All Routes View for Admin
@api_view(["GET"])
@permission_classes([IsAdminUser])
def routes(request):
    data = {}
    routes_filter = []
    routes = Route.routeTables.all()
    # COMMENTED OUT CODE FOR PAGINATION
    # page_number = request.query_params["page"]
    # # For now I will retrieve 10 records for each page request, can be changed
    # if int(page_number) == 1:
    #     routes = Route.routeTables.all()[:10*int(page_number)]
    # else:
    #     routes = Route.routeTables.all()[1+10*(int(page_number)-1):10*int(page_number)]
    route_serializer = RouteSerializer(routes, many=True)
    for route in route_serializer.data:
        id = route["id"]
        name = route["name"]
        school = School.schoolsTable.get(pk=route["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        route_students = Student.studentsTable.filter(route_id=id)
        student_serializer = StudentSerializer(route_students, many=True)
        student_count = len(student_serializer.data)
        routes_filter.append({'id' : id, 'name' : name, 'school_name': school_name, 'student_count': student_count})
    data["routes"] = routes_filter
    return Response(data)