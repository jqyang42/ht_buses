from ...models import Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, UserSerializer

@api_view(["GET"])
@permission_classes([IsAdminUser])
def users_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        user = User.objects.get(pk=id)
        user_serializer = UserSerializer(user, many=False)
        data["first_name"] = user_serializer.data["first_name"]
        data["last_name"] = user_serializer.data["last_name"]
        data["email"] = user_serializer.data["email"]
        if user_serializer.data["is_parent"] == True:
            data["address"] = user_serializer.data["address"]
            students = Student.studentsTable.filter(user_id=user_serializer.data["id"])
            students_serializer = StudentSerializer(students, many=True)
            student_list = []
            for student in students_serializer.data:
                student_id = student["id"]
                student_school_id = student["student_school_id"]
                student_first_name = student["first_name"]
                student_last_name = student["last_name"]
                if student["route_id"] == None:
                    route_name = "Unassigned"
                else:
                    route_student = Route.routeTables.get(pk=student["route_id"])
                    route_serializer = RouteSerializer(route_student, many=False)
                    route_name = route_serializer.data["name"]
                student_list.append({'id' : student_id, 'student_school_id': student_school_id, 'first_name': student_first_name, 'last_name' : student_last_name, 'route_name' : route_name})
            data["students"] = student_list
        data["is_staff"] = user_serializer.data["is_staff"]
        data["is_parent"] = user_serializer.data["is_parent"]
        return Response(data)
    except BaseException as e:
        raise ValidationError({"message": "User does not exist"})