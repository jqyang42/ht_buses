from ....models import School, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from rest_framework.response import Response
from io import StringIO
from ..bulk_import_file_manage import bulk_import_file_save, bulk_import_file_read
import csv
import re

# Bulk import temporary file name
FILENAME = 'bulk_import_students_temp.json'

# Bulk Import POST API: Checking for Students
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def bulk_import(request):
    req_file = request.FILES["bulk_students"]
    data = {}
    errors_msg = []
    students = []
    errors = []
    row_num = 1
    email_error_message = ""
    phone_number_error_message = ""
    name_error_message = ""
    address_error_message = ""
    headers = ["name", "parent_email", "student_id", "school_name"]
    csv_file = StringIO(req_file.read().decode('latin-1'))
    # regex
    file_regex = r'.*\.csv$'
    # check file type: send error
    if re.fullmatch(file_regex, req_file.name) is None:
        data["students"] = {}
        data["success"] = False
        return Response(data, status=404)
    reader = csv.DictReader(csv_file, headers, delimiter=',')
    # skip the header
    next(reader, None)
    for row in reader:
        # name, parent_email, student_id, school_name
        if row["parent_email"] is None or row["parent_email"] == "":
            email_error = True
            email_error_message = "Parent email field cannot be empty."
        else:
            if len(row["parent_email"]) > 254: 
                email_error = True
                email_error_message = "Parent email cannot be more than 254 characters."
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, row[0]):
                    # check email is associated with parent
                    user = User.objects.filter(email=row[0])
                    if len(user) == 0:
                        email_error = True
                        email_error_message = "Parent does not exist in system."
                    else:
                        email_error = False
                else:
                    email_error = False

        if row["name"] is None or row["name"] == "":
            name_error = True
            name_error_message = "Name field cannot be empty."
        else:
            if len(row["name"]) > 150:
                name_error = True
                name_error_message = "Name cannot be more that 150 characters."
            else:
                name_error = False
        
        if row["student_id"] is None or row["student_id"] == "":
            student_id = 0
        else:
            student_id = row["student_id"]
        student_id_error = False
        
        if row["school_name"] is None or row["school_name"] == "":
            school_name_error = True
            school_name_error_message = "School name field cannot be empty."
        else:
            # Need a better check with schools --> School 1 is in system, if they type in School it will be like School 1 and we don't want that
            schools = School.objects.filter(name__icontains=row[3])
            if len(schools) == 0:
                    school_name_error = True
                    school_name_error_message = "School does not exist."
            else:
                school_name_error = False
            
        if name_error or email_error or student_id_error or school_name_error:
            error_message = {"row_num": row_num, "name": name_error_message, "parent_email": email_error_message, "student_id": False, "school_name": school_name_error_message}
            error_obj = {"row_num" : row_num, "name": name_error, "parent_email": email_error, "student_id": student_id_error, "school_name": school_name_error, "duplicate_name": False, "duplicate_parent_email": False, "error_message": error_message}
            errors.append(error_obj)
        else:
            error_obj = {}
        row_obj = {"row_num" : row_num, "name": row["name"], "parent_email": row["parent_email"], "student_id": student_id, "school_name": row["school_name"], "error": error_obj}
        students.append(row_obj)
        row_num += 1
    # empty file check
    if len(students) == 0:
        data["students"] = {}
        data["success"] = False
        return Response(data, status=404)

    # duplicate checking
        for i in range(0, len(users)):
            for j in range(i + 1, len(users)):
                if users[i]["name"] == users[j]["name"] and users[i]["email"] == users[j]["email"]:
                    users[i]["error"]["duplicate_name"] = True
                    users[j]["error"]["duplicate_name"] = True
                    users[i]["error"]["duplicate_email"] = True
                    users[j]["error"]["duplicate_email"] = True
                    users[i]["exclude"] = True
                    users[j]["exclude"] = True
                    if len(errors) == 0:
                        new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": True}
                        new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": True}
                        errors.append(new_error)
                        errors.append(new_errors)
                    else:
                        for k in range(0, len(errors)):
                            if errors[k]["row_num"] == users[i]["row_num"]:
                                errors[k]["duplicate_name"] = True
                                errors[k]["duplicate_email"] = True
                            else:
                                new_error = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": True}
                                errors.append(new_error)
                            if errors[k]["row_num"] == users[j]["row_num"]:
                                errors[k]["duplicate_name"] = True
                                errors[k]["duplicate_email"] = True
                            else:
                                new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": True}
                                errors.append(new_error)


                elif users[i]["name"] == users[j]["name"]:
                    users[i]["error"]["duplicate_name"] = True
                    users[j]["error"]["duplicate_name"] = True
                    users[i]["exclude"] = True
                    users[j]["exclude"] = True
                    if len(errors) == 0:
                        new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": True}
                        new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": True}
                        errors.append(new_error)
                        errors.append(new_errors)
                    else:
                        for k in range(0, len(errors)):
                            if errors[k]["row_num"] == users[i]["row_num"]:
                                errors[k]["duplicate_name"] = True
                            else:
                                new_error = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": True}
                                errors.append(new_error)
                            if errors[k]["row_num"] == users[j]["row_num"]:
                                errors[k]["duplicate_name"] = True
                            else:
                                new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": True}
                                errors.append(new_error)
                
                elif users[i]["email"] == users[j]["email"]:
                    users[i]["error"]["duplicate_email"] = True
                    users[j]["error"]["duplicate_email"] = True
                    users[i]["exclude"] = True
                    users[j]["exclude"] = True
                    if len(errors) == 0:
                        new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": False}
                        new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": False}
                        errors.append(new_error)
                        errors.append(new_errors)
                    else: 
                        for k in range(0, len(errors)):
                            if errors[k]["row_num"] == users[i]["row_num"]:
                                errors[k]["duplicate_email"] = True
                            else:
                                new_error = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": False}
                                errors.append(new_error)
                            if errors[k]["row_num"] == users[j]["row_num"]:
                                errors[k]["duplicate"] = True
                            else:
                                new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": False}
                                errors.append(new_error)

    
    data["students"] = students
    data["errors"] = errors
    data["success"] = True
    bulk_import_file_save(FILENAME, data)
    return Response(data)




    
