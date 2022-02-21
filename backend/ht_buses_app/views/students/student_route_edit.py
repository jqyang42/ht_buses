from ...models import Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from ...serializers import StudentSerializer
from ..stops import check_in_range
from ..routes import route_check_is_complete

# Student Route PUT API
# Need to test
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def student_route_edit(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        student_arr = []
        for student in reqBody["students"]:
            student_id = student["id"]
            route_id = student["route_id"]
            in_range = student["in_range"]
            student_obj = Student.studentsTable.get(pk=student_id)
            if route_id == 0:
                student_obj.route_id = None
            else:
                student_obj.route_id = Route.routeTables.get(pk=route_id)
                student_obj_serializer = StudentSerializer(student_obj, many=False)
                stop_arr = check_in_range.check_student_in_range(student_obj_serializer.data["user_id"], route_id)
                if len(stop_arr) != 0:
                    in_range = True
                else:
                    in_range = False
                student_obj.in_range = in_range
                student_route = Route.routeTables.get(pk=route_id)
                is_complete = route_check_is_complete.route_is_complete(route_id)
                student_route.is_complete = is_complete
                student_route.save()
            student_obj.save()
            student_serializer = StudentSerializer(student_obj, many=False)
            student_arr.append(student_serializer.data)
        data["message"] = "student's route information was successfully updated"
        data["student"] = student_arr
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "student was not added/removed to route"
        data["success"] = False
        return Response(data, status = 404)