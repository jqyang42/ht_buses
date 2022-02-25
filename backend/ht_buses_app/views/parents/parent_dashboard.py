from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
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
        students = Student.studentsTable.filter(user_id=id)
        student_serializer = StudentSerializer(students, many=True)
        parent_kids = []
        for student in student_serializer.data:
            id = student["id"]
            student_school_id = student["student_school_id"]
            first_name = student["first_name"]
            last_name = student["last_name"]
            school = School.objects.get(pk=student["school_id"])
            school_serializer = SchoolSerializer(school, many=False)
            school_name = school_serializer.data["name"]
            if student["route_id"] == None:
                route_arr = {"id": 0, "color_id": 0}
            else:
                route = Route.objects.get(pk=student["route_id"])
                route_serializer = RouteSerializer(route, many=False)
                route_name = route_serializer.data["name"]
                route_arr = {"id": student["route_id"], "name": route_name, "color_id": route_serializer.data["color_id"]}
            parent_kids.append({'id' : id, 'student_school_id': student_school_id, 'first_name' : first_name, 'last_name' : last_name, 'school_name' : school_name, 'route' : route_arr})
        data["user"] = {"first_name": user_serializer.data["first_name"], "last_name": user_serializer.data["last_name"], "students": parent_kids}
        data["success"] = True
        return Response(data)
    except:
        data["success"] = False
        return Response(data, status = 404)