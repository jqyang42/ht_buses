from ....models import School, User, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from rest_framework.response import Response
from ....serializers import SchoolSerializer, UserSerializer
import json
from guardian.shortcuts import get_objects_for_user
from ...students.student_account import create_student_account

# Bulk Import POST API: Create Students :)
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def students_create(request):
    data = {}
    student_count = 0
    reqBody = json.loads(request.body)
    for student in reqBody["students"]:
        # name, parent_email, student_id, school_name
        if student["exclude"] == False:
            student_count += 1
            name = student["name"].split(" ", 1)
            first_name = name[0]
            last_name = name[1]
            student_school_id = student["student_id"]
            all_validated_schools = get_objects_for_user(request.user, "change_school", School.objects.all())
            school_name_clean = ' '.join(student["school_name"].strip().split())
            school_name_clean = school_name_clean.lower()
            school = all_validated_schools.filter(name__iexact=school_name_clean)
            if len(school) != 0: 
                school_serializer = SchoolSerializer(school[0], many=False)
                student_school = School.objects.get(pk=school_serializer.data["id"])
                user = User.objects.filter(email=student["parent_email"])[0]
                user_serializer = UserSerializer(user, many=False)
                parent = User.objects.get(pk=user_serializer.data["id"])
                student_object = Student.objects.create(
                    first_name = first_name,
                    last_name = last_name,
                    student_school_id = student_school_id,
                    school_id = student_school,
                    route_id = None,
                    user_id = parent
                )
            if student["student_email"] != "" and student["student_email"] is not None:
                create_student_account(student_object,student["student_email"]) 
    data["success"] = True
    data["student_count"] = student_count
    return Response(data)




    
