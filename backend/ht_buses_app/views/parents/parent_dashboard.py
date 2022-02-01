from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def parent_dashboard(request):
    data = {}
    try:
        id = request.query_params["id"] # need id of parent
        user = User.objects.get(pk=id)
        user_serializer = UserSerializer(user, many=False)
        data["first_name"] = user_serializer.data["first_name"]
        data["last_name"] = user_serializer.data["last_name"]
        students = Student.studentsTable.filter(user_id=id)
        student_serializer = StudentSerializer(students, many=True)
        parent_kids = []
        for student in student_serializer.data:
            id = student["id"]
            first_name = student["first_name"]
            last_name = student["last_name"]
            school = School.schoolsTable.get(pk=student["school_id"])
            school_serializer = SchoolSerializer(school, many=False)
            school_name = school_serializer.data["name"]
            if student["route_id"] == None:
                route_name = "Unassigned" # Config after credentials
            else:
                route = Route.routeTables.get(pk=student["route_id"])
                route_serializer = RouteSerializer(route, many=False)
                route_name = route_serializer.data["name"]
            parent_kids.append({'id' : id, 'first_name' : first_name, 'last_name' : last_name, 'school_name' : school_name, 'route_name' : route_name})
        data["students"] = parent_kids
        return Response(data)
    except:
        return Response(data, status = 404)