from ....models import School, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin
from rest_framework.response import Response
import re
import json


# Bulk Import POST Validate API: Checking for Students
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin]) 
def bulk_import_validate(request):
    data = {}
    reqBody = json.loads(request.body)
    students = []
    errors = []
    for student in reqBody["students"]:
        # name, parent_email, student_id, school_name
        if student["parent_email"] is None or student["parent_email"] == "":
            email_error = True
        else:
            # TODO: need to have check for duplicates
            if len(student["parent_email"]) > 254: # make models for email char higher
                email_error = True
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, student["parent_email"]):
                    # check email is associated with parent
                    user = User.objects.filter(email=student["parent_email"])
                    if len(user) == 0:
                        email_error = True
                    else:
                        email_error = False
        if student["name"] is None or student["name"] == "":
            name_error = True
        else:
            if len(student["name"]) > 150:
                name_error = True
            else:
                name_error = False
        
        if student["student_school_id"] is None:
            student_id = 0
        else:
            student_id = student["student_school_id"]
        student_id_error = False
        
        if student["school_name"] is None or student["school_name"] == "":
            school_name_error = True
        else:
            # Need a better check with schools --> School 1 is in system, if they type in School it will be like School 1 and we don't want that
            schools = School.objects.filter(name_icontains=student["school_name"])
            if len(schools) == 0:
                    school_name_error = True
            else:
                school_name_error = False
            
        if name_error or email_error or student_id_error or school_name_error:
            error_obj = {"row_num" : student["row_num"], "name": name_error, "parent_email": email_error, "student_school_id_error": student_id_error, "school_name_error": school_name_error}
            errors.append(error_obj)
        else:
            error_obj = {}
        row_obj = {"row_num" : student["row_num"], "name": student["name"], "parent_email": student["parent_email"], "student_school_id": student_id, "school_name": student["school_name"], "error": error_obj}
        students.append(row_obj)
    data["students"] = students
    data["errors"] = errors
    data["success"] = True
    return Response(data)




    
