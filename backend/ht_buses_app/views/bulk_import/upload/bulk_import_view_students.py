from ....models import School, User, Student, Location
from ....serializers import StudentSerializer, SchoolSerializer, UserSerializer, LocationSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from rest_framework.response import Response
from io import StringIO
from ..bulk_import_file_manage import bulk_import_file_save
import csv
import re
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 
from guardian.shortcuts import get_objects_for_user

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
    school_name_error_message = ""
    email_error_message = ""
    name_error_message = ""
    student_id_error_message = ""
    existing_students = []
    headers = ["name", "parent_email", "student_id", "school_name"]
    csv_file = StringIO(req_file.read().decode('utf-8-sig'))
    # regex
    file_regex = r'.*\.csv$'
    # check file type: send error
    if re.fullmatch(file_regex, req_file.name) is None:
        data["students"] = {}
        data["success"] = False
        return Response(data, status=404)
    reader = csv.DictReader(csv_file, delimiter=',')
    header_csv = reader.fieldnames

    if len(header_csv) == len(headers):
        if header_csv[0] != headers[0] or header_csv[1] != headers[1] or header_csv[2] != headers[2] or header_csv[3] != headers[3]:
            data["students"] = {}
            data["success"] = False
            return Response(data, status=404)
    else:
        data["students"] = {}
        data["success"] = False
        return Response(data, status=404)
    # skip the header

    for row in reader:
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
                    user = User.objects.filter(email=row["parent_email"])
                    print(user)
                    print(row["parent_email"])
                    if len(user) == 0:
                        email_error = True
                        email_error_message = "Parent does not exist in system"
                    else:
                        user_email_serializer = UserSerializer(user, many=True)
                        location = Location.objects.get(pk=user_email_serializer.data[0]["location"])
                        location_serializer = LocationSerializer(location, many=False)
                        if location_serializer.data["address"] == None or location_serializer.data["address"] == "":
                            email_error = True
                            email_error_message = "Student cannot be linked to user because user does not have an address"
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
            # check if student_id is an integer
            try:
                valid_student_id = int(row["student_id"])
                student_id = row["student_id"]
                student_id_error = False
            except:
                student_id_error = True
                student_id = row["student_id"]
                student_id_error_message = "Student id must be an integer value"
        
        if row["school_name"] is None or row["school_name"] == "":
            school_name_error = True
            school_name_error_message = "School name field cannot be empty"
        else:
            # Need a better check with schools --> School 1 is in system, if they type in School it will be like School 1 and we don't want that
            school_name_clean = ' '.join(row["school_name"].strip().split()).casefold()
            school_name_clean = school_name_clean.lower()
            school_exists =  School.objects.filter(name__iexact=school_name_clean)
            if len(school_exists) == 0:
                    school_name_error = True
                    school_name_error_message = "School does not exist"
            all_validated_schools = get_objects_for_user(request.user, "change_school", School.objects.all())
            validated_school = all_validated_schools.filter(name__iexact=school_name_clean)
            if len(validated_school) == 0:
                    school_name_error = True
                    school_name_error_message = "User cannot create students at this school"
            else:
                school_name_error = False
            
        if name_error or email_error or student_id_error or school_name_error:
            error_message = {"row_num": row_num, "name": name_error_message, "parent_email": email_error_message, "student_id": student_id_error_message, "school_name": school_name_error_message}
            error_obj = {"row_num" : row_num, "name": name_error, "parent_email": email_error, "student_id": student_id_error, "school_name": school_name_error, "duplicate_name": False, "duplicate_parent_email": False, "error_message": error_message, "existing_students": existing_students, "exclude": False}
            errors.append(error_obj)
            errors_msg.append(error_message)
        else:
            error_message = {"row_num": row_num, "name": name_error_message, "parent_email": email_error_message, "student_id": student_id_error_message, "school_name": school_name_error_message}
            error_obj = {"row_num" : row_num, "name": name_error, "parent_email": email_error, "student_id": student_id_error, "school_name": school_name_error, "duplicate_name": False, "duplicate_parent_email": False, "error_message": error_message, "existing_students": existing_students, "exclude": False}
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
            student_i_name = ' '.join(students[i]["name"].strip().split()).casefold()
            student_j_name = ' '.join(students[j]["name"].strip().split()).casefold()

            student_i_email = students[i]["parent_email"].strip().casefold()
            student_j_email = students[j]["parent_email"].strip().casefold()

            if student_i_name == student_j_name and student_i_email == student_j_email:
                students[i]["error"]["duplicate_name"] = True
                students[j]["error"]["duplicate_name"] = True
                students[i]["error"]["duplicate_parent_email"] = True
                students[j]["error"]["duplicate_parent_email"] = True
                students[i]["exclude"] = True
                students[j]["exclude"] = True
                if len(errors) == 0:
                    new_error = {"row_num" : students[j]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": [], "exclude": False}
                    new_errors = {"row_num" : students[i]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": [], "exclude": False}
                    errors.append(new_error)
                    errors.append(new_errors)
                else:
                    student_i_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == students[i]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            errors[k]["duplicate_parent_email"] = True
                            student_i_found = True
                    if student_i_found == False:
                        new_errors = {"row_num" : students[i]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": [], "exclude": False}
                        errors.append(new_errors)

                    student_j_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == students[j]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            errors[k]["duplicate_parent_email"] = True
                            student_j_found = True
                    if student_j_found == False:
                        new_error = {"row_num" : students[j]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": True, "error_message": [], "existing_students": [], "exclude": False}
                        errors.append(new_errors)


            elif student_i_name == student_j_name:
                students[i]["error"]["duplicate_name"] = True
                students[j]["error"]["duplicate_name"] = True
                students[i]["exclude"] = True
                students[j]["exclude"] = True
                if len(errors) == 0:
                    new_error = {"row_num" : students[j]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": False, "error_message": [], "existing_students": [], "exclude": False}
                    new_errors = {"row_num" : students[i]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": False, "error_message": [], "existing_students": [], "exclude": False}
                    errors.append(new_error)
                    errors.append(new_errors)
                else:
                    student_i_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == students[i]["row_num"]:
                            errors[k]["duplicate_name"] = True
                    if student_i_found == False:
                        new_errors = {"row_num" : students[i]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": False, "error_message": [], "existing_students": [], "exclude": False}
                        errors.append(new_errors)

                    student_j_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == students[j]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            student_j_found = True
                    if student_j_found == False:
                        new_error = {"row_num" : students[j]["row_num"], "name": False, "parent_email": False, "student_id": False, "school_name": False, "duplicate_name": True, "duplicate_parent_email": False, "error_message": [], "existing_students": [], "exclude": False}
                        errors.append(new_errors)
    
    data["students"] = students
    data["errors"] = errors
    data["success"] = True
    bulk_import_file_save(FILENAME, data)
    return Response(data)




    