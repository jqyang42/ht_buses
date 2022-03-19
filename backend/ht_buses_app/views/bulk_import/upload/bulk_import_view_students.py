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
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, row[0]):
                    # check email is associated with parent
                    user = User.objects.filter(email=row[0])
                    if len(user) == 0:
                        email_error = True
                    else:
                        email_error = False
                else:
                    email_error = False

        if row[0] is None:
            name_error = True
        else:
            if len(row[0]) > 150:
                name_error = True
            else:
                name_error = False
        
        if row[2] is None:
            student_id = 0
        else:
            student_id = row[2]
        student_id_error = False
        
        if row[3] is None:
            school_name_error = True
        else:
            # Need a better check with schools --> School 1 is in system, if they type in School it will be like School 1 and we don't want that
            schools = School.objects.filter(name__icontains=row[3])
            if len(schools) == 0:
                    school_name_error = True
            else:
                school_name_error = False
            
        if name_error or email_error or student_id_error or school_name_error:
            error_obj = {"row_num" : row_num, "name": name_error, "parent_email": email_error, "student_school_id_error": student_id_error, "school_name_error": school_name_error}
            errors.append(error_obj)
        else:
            error_obj = {}
        row_obj = {"row_num" : row_num, "name": row[0], "parent_email": row[1], "student_school_id": student_id, "school_name": row[3], "error": error_obj}
        students.append(row_obj)
        row_num += 1
    # empty file check
    if len(students) == 0:
        data["students"] = {}
        data["success"] = False
        return Response(data, status=404)
    bulk_import_file_save(FILENAME, students)
    bulk_import_file_read(FILENAME)
    data["students"] = students
    data["errors"] = errors
    data["success"] = True
    return Response(data)




    
