from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response

# Students PUT API
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def student_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    new_first_name = reqBody['first_name']
    new_last_name = reqBody['last_name']
    student_school_id = reqBody['student_school_id']
    try:
        og_student_object = Student.studentsTable.get(pk = id) 
    except: 
        data["message"] = "Student was not found. Update was unsucessful"
        result = {"data" : data}
        return Response(result)
    try:
        school_id = School.schoolsTable.get(pk=reqBody["school_id"])
        user_id = User.objects.get(pk = reqBody["parent_id"]) 
        og_student_object.last_name = new_last_name
        og_student_object.first_name = new_first_name
        og_student_object.school_id = school_id
        og_student_object.student_school_id = student_school_id
        og_student_object.user_id = user_id
    except:
        data["message"] = "Invalid options were chosen. Update was unsuccessful"
        result = {"data" : data}
        return Response(result)
    try: 
        og_student_object.route_id = Route.routeTables.get(pk=reqBody["route_id"])
    except: 
        og_student_object.route_id = None
    og_student_object.save()
    data["message"] = "Student information successfully updated"
    data["student"] = {"first_name": new_first_name, "last_name": new_last_name, "student_school_id": student_school_id, "route_id": reqBody["route_id"], "user_id": user_id.id}
    result = {"data" : data} # TODO: Ask evelyn why it's not updated on students page?
    return Response(result)