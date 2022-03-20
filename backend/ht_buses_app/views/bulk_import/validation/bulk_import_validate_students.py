from ....models import School, User, Student
from ....serializers import StudentSerializer, SchoolSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from rest_framework.response import Response
import re
import json
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 
from guardian.shortcuts import get_objects_for_user

# Bulk Import POST Validate API: Checking for Students
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def bulk_import_validate(request):
    data = {}
    errors_msg = []
    students = []
    errors = []
    row_num = 1
    school_name_error_message = ""
    email_error_message = ""
    name_error_message = ""
    existing_students = []
    reqBody = json.loads(request.body)
   
    for row in reqBody["students"]:
        # name, parent_email, student_id, school_name
        if row["parent_email"] is None or row["parent_email"] == "":
            email_error = True
            email_error_message = "Parent email field cannot be empty"
        else:
            if len(row["parent_email"]) > 254: 
                email_error = True
                email_error_message = "Parent email cannot be more than 254 characters"
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, row["parent_email"]):
                    # check email is associated with parent
                    #user_email = get_objects_for_user(request.users, "view_user", User.objects.all())
                    user = User.objects.filter(email=row["parent_email"])

                    if len(user) == 0:
                        email_error = True
                        email_error_message = "Parent does not exist in system"
                    else:
                        print(user)
                        user_email_serializer = UserSerializer(user, many=True)
                        print(user_email_serializer.data)
                        if user_email_serializer.data[0]["location"] == None or user_email_serializer.data[0]["location"] == "":
                            email_error = True
                            email_error_message = "User has an invalid addresss"
                        else:
                            email_error = False
                else:
                    email_error = False

        if row["name"] is None or row["name"] == "":
            name_error = True
            name_error_message = "Name field cannot be empty"
        else:
            if len(row["name"]) > 150:
                name_error = True
                name_error_message = "Name cannot be more that 150 characters"
            else:
                # check if name exists in system
                exist_students = Student.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=row["name"]) | Q(first_name__icontains=row["name"]) | Q(last_name__icontains=row["name"]))
                if len(exist_students) == 0:
                    name_error = False
                else:
                    name_error = True
                    name_error_message = "Name may already exist in the system"
                    ex_students = []
                    exist_student_serializer = StudentSerializer(exist_students, many=True)
                    for i in range(0, len(exist_student_serializer.data)):
                        exist_first_name = exist_student_serializer.data[i]["first_name"]
                        exist_last_name = exist_student_serializer.data[i]["last_name"]
                        exist_student_id = exist_student_serializer.data[i]["student_school_id"]
                        exist_parent_id = exist_student_serializer.data[i]["user_id"]
                        exist_school_id = exist_student_serializer.data[i]["school_id"]
                        exist_school = School.objects.get(pk=exist_school_id)
                        exist_parent = User.objects.get(pk=exist_parent_id)
                        exist_school_serializer = SchoolSerializer(exist_school, many=False)
                        exist_parent_serializer = UserSerializer(exist_parent, many=False)
                        ex_students.append({"id": exist_student_serializer.data[i]["id"], "first_name": exist_first_name, "last_name": exist_last_name, "student_id": exist_student_id, "school_name": exist_school_serializer.data["name"], "parent_email": exist_parent_serializer.data["email"]})
                    existing_students = ex_students
    
        if row["student_id"] is None or row["student_id"] == "":
            student_id = 0
        else:
            student_id = row["student_id"]
        student_id_error = False
        
        if row["school_name"] is None or row["school_name"] == "":
            school_name_error = True
            school_name_error_message = "School name field cannot be empty"
        else:
            school_name_clean = ' '.join(row["school_name"].split())
            school_name_clean = school_name_clean.lower()
            # need to be filtered by managed schools
            #school_obj = get_objects_for_user(request.user,"view_school", School.objects.all())
            schools = School.objects.filter(name__iexact=school_name_clean)
            if len(schools) == 0:
                    school_name_error = True
                    school_name_error_message = "School does not exist"
            else:
                school_name_error = False
            
        if name_error or email_error or student_id_error or school_name_error:
            error_message = {"row_num": row_num, "name": name_error_message, "parent_email": email_error_message, "student_id": "", "school_name": school_name_error_message}
            error_obj = {"row_num" : row_num, "name": name_error, "parent_email": email_error, "student_id": student_id_error, "school_name": school_name_error, "duplicate_name": False, "duplicate_parent_email": False, "error_message": error_message, "existing_students": existing_students}
            errors.append(error_obj)
            errors_msg.append(error_message)
        else:
            error_message = {"row_num": row_num, "name": name_error_message, "parent_email": email_error_message, "student_id": "", "school_name": school_name_error_message}
            error_obj = {"row_num" : row_num, "name": name_error, "parent_email": email_error, "student_id": student_id_error, "school_name": school_name_error, "duplicate_name": False, "duplicate_parent_email": False, "error_message": error_message, "existing_students": existing_students}
        row_obj = {"row_num" : row_num, "name": row["name"], "parent_email": row["parent_email"], "student_id": student_id, "school_name": row["school_name"], "error": error_obj, "exclude": False}
        students.append(row_obj)
        row_num += 1
    # empty file check
    if len(students) == 0:
        data["students"] = {}
        data["success"] = False
        return Response(data, status=404)

    # duplicate checking
    for i in range(0, len(students)):
        for j in range(i + 1, len(students)):
            if students[i]["name"] == students[j]["name"] and students[i]["parent_email"] == students[j]["parent_email"]:
                students[i]["error"]["duplicate_name"] = True
                students[j]["error"]["duplicate_name"] = True
                students[i]["error"]["duplicate_parent_email"] = True
                students[j]["error"]["duplicate_parent_email"] = True
                students[i]["exclude"] = True
                students[j]["exclude"] = True
                if len(errors) == 0:
                    new_error = {"row_num" : students[j]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": []}
                    new_errors = {"row_num" : students[i]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": []}
                    errors.append(new_error)
                    errors.append(new_errors)
                else:
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == students[i]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            errors[k]["duplicate_parent_email"] = True
    
                        if errors[k]["row_num"] == students[j]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            errors[k]["duplicate_parent_email"] = True


            elif students[i]["name"] == students[j]["name"]:
                students[i]["error"]["duplicate_name"] = True
                students[j]["error"]["duplicate_name"] = True
                students[i]["exclude"] = True
                students[j]["exclude"] = True
                if len(errors) == 0:
                    new_error = {"row_num" : students[j]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": []}
                    new_errors = {"row_num" : students[i]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": []}
                    errors.append(new_error)
                    errors.append(new_errors)
                else:
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == students[i]["row_num"]:
                            errors[k]["duplicate_name"] = True
                
                        if errors[k]["row_num"] == students[j]["row_num"]:
                            errors[k]["duplicate_name"] = True
            
            elif students[i]["parent_email"] == students[j]["parent_email"]:
                students[i]["error"]["duplicate_parent_email"] = True
                students[j]["error"]["duplicate_parent_email"] = True
                students[i]["exclude"] = True
                students[j]["exclude"] = True
                if len(errors) == 0:
                    new_error = {"row_num" : students[j]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": []}
                    new_errors = {"row_num" : students[i]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": []}
                    errors.append(new_error)
                    errors.append(new_errors)
                else: 
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == students[i]["row_num"]:
                            errors[k]["duplicate_parent_email"] = True
                        
                        if errors[k]["row_num"] == students[j]["row_num"]:
                            errors[k]["duplicate_parent_email"] = True
    
    data["students"] = students
    data["errors"] = errors
    data["success"] = True
    return Response(data)




    
