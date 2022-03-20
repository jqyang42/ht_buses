from ....models import School, User, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from rest_framework.response import Response
from ....serializers import SchoolSerializer, UserSerializer
import json
from guardian.shortcuts import get_objects_for_user

# Bulk Import POST API: Create Students :)
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def students_create(request):
    data = {}
    reqBody = json.loads(request.body)
    for student in reqBody["students"]:
        # name, parent_email, student_id, school_name
        if student["exclude"] == False:
            name = student["name"].split(" ", 1)
            first_name = name[0]
            last_name = name[1]
            student_school_id = student["student_id"]
            all_validated_schools = get_objects_for_user(request.user, "change_school", School.objects.all())
            school = all_validated_schools.filter(name=student["school_name"])
            if len(school) != 0: 
                school_serializer = SchoolSerializer(school[0], many=False)
                student_school = School.objects.get(pk=school_serializer.data["id"])
                user = User.objects.filter(email=student["parent_email"])[0]
                user_serializer = UserSerializer(user, many=False)
                parent = User.objects.get(pk=user_serializer.data["id"])
                student = Student.objects.create(
                    first_name = first_name,
                    last_name = last_name,
                    student_school_id = student_school_id,
                    school_id = student_school,
                    route_id = None,
                    user_id = parent
                )
    data["success"] = True
    data["student_count"] = len(reqBody["students"])
    return Response(data)




    
