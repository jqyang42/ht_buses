from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response
from .student_create import create_student

@api_view(["POST"])
@csrf_exempt
@permission_classes([AllowAny])
def add_new_students(request):
    data = {}
    user_id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        for student in reqBody["students"]:
            create_student(student, user_id)
        data["message"] = "students created successfully"
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "user does not exist, you can only add students to an existing user"
        data["success"] = False
        return Response(data, status = 404) 