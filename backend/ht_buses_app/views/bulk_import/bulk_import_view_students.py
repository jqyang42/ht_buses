from ...models import School, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ...role_permissions import IsAdmin
import csv
from rest_framework.response import Response
import re
from io import StringIO

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin]) 
def bulk_import(request):
    req_file = request.FILES["bulk_students"]
    csv_file = StringIO(req_file.read().decode('latin-1'))
    data = {}
    students = []
    row_num = 1
    reader = csv.reader(csv_file)
    # skip the header
    next(reader, None)
    for row in reader:
        # name, parent_email, student_id, school_name
        if row[1] is None:
            email_error = True
        else:
            # TODO: need email already exists in system
            # TODO: need to have check for duplicates
            if len(row[1]) > 254: # make models for email char higher
                email_error = True
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, row[0]):
                    email_error = False
                else:
                    # check email is associated with parent
                    try:
                        user = User.objects.filter(email=row[1])
                        email_error = False
                    except:
                        email_error = True
        
        if row[0] is None:
            name_error = True
        else:
            # check if name is 150 char limit, add to db
            if len(row[0]) > 150:
                name_error = True
            else:
                name_error = False
        
        if row[2] is None:
            student_id = 0
        student_id_error = False
        
        if row[3] is None:
            school_name_error = True
        else:
            try:
                schools = School.filter(name__icontains=row[3])
                school_name_error = False
            except:
                school_name_error = True
            
        if name_error or email_error or student_id_error or school_name_error:
            error_obj = {"row_num" : row_num, "name": name_error, "parent_email": email_error, "student_id_error": student_id_error, "school_name_error": school_name_error}
        else:
            error_obj = {}
        row_obj = {"row_num" : row_num, "name": row[0], "parent_email": row[1], "student_id": row[2], "school_name": row[3], "error": error_obj}
        students.append(row_obj)
        row_num += 1
    
    # we need to grab a certain number of users
    data["students"] = students
    data["success"] = True
    return Response(data)





    
