from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response
from .student_create import create_student

@api_view(["POST"])
@csrf_exempt
@permission_classes([IsAdminUser])
def add_new_students(request):
    data = {}
    user_id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        for student in reqBody["students"]:
            create_student(student, user_id)
        data["message"] = "Students created successfully"
        result = {"data" : data}
        return Response(result)
    except:
        data["message"] = "User does not exist. You can only add students to an existing user"
        result = {"data" : data}
        return Response(result) 