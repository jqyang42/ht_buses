from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response
from .student_create import create_student
from ...models import User
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import get_object_for_user, reassign_after_creation
from ..general import response_messages
from guardian.shortcuts import assign_perm

@api_view(["POST"])
@csrf_exempt
@permission_classes([IsAdmin|IsSchoolStaff])
def add_new_students(request):
    data = {}
    user_id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        user = User.objects.get(pk = user_id)
    except:
        return response_messages.DoesNotExist(data, "student's parent")
    try:
        for student in reqBody["students"]:
            create_student(student, user_id)
        reassign_after_creation(user)
        data["message"] = "students created successfully"
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "adding student(s)")