from ...models import Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
from ...serializers import StudentSerializer

# Student Route PUT API
# Need to test
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def student_route_edit(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        for student in reqBody["students"]:
            student_id = student["id"]
            route_id = student["route_id"]
            student_obj = Student.studentsTable.get(pk=student_id)
            if route_id == 0:
                student_obj.route_id = None
            else:
                 student_obj.route_id = Route.routeTables.get(pk=student["route_id"])
            student_obj.save()
        data["message"] = "student's route information was successfully updated"
        student_serializer = StudentSerializer(student_obj, many=False)
        data["student"] = student_serializer.data
    except:
        data["message"] = "student was not added/removed to route"
        return Response(data, status = 404)