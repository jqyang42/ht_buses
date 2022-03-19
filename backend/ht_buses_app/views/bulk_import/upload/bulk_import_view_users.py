from ....models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from ....google_funcs import geocode_address
from rest_framework.response import Response
from io import StringIO
from ..bulk_import_file_manage import bulk_import_file_save, bulk_import_file_read
import csv
import re

# Bulk import temporary file name
FILENAME = 'bulk_import_users_temp.json'

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def bulk_import(request):
    req_file = request.FILES["bulk_users"]
    csv_file = StringIO(req_file.read().decode('latin-1'))
    data = {}
    users = []
    errors = []
    errors_msg = []
    row_num = 1
    email_error_message = ""
    phone_number_error_message = ""
    name_error_message = ""
    address_error_message = ""
    headers = ["email", "name", "address", "phone_number"]
    # regex
    file_regex = r'.*\.csv$'
    # check file type: send error
    if re.fullmatch(file_regex, req_file.name) is None:
        data["users"] = {}
        data["success"] = False
        return Response(data, status=404)
    reader = csv.DictReader(csv_file, headers, delimiter=',')
    # skip the header
    next(reader, None)
    for row in reader:
        # email, name, address, phone_number
        if row["email"] is None or row["email"] == "":
            email_error = True
            email_error_message = "Email field cannot be empty."
        else:
            # TODO: need to have check for duplicates
            if len(row["email"]) > 254:
                email_error = True
                email_error_message = "Email is over 254 character limit."
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, row["email"]):
                    email_error = False
                    users_obj = User.objects.filter(email=row["email"])
                    if len(users_obj) == 0:
                        email_error = False
                    else:
                        email_error_message = "Email is being used already in the system."
                        email_error = True
        if row["name"] is None or row["name"] == "":
            name_error = True
            name_error_message = "Name field cannot be empty."
        else:
            # check if name is 150 char limit
            if len(row["name"]) > 150:
                name_error = True
                name_error_message = "Name cannot be more that 150 characters."
            else:
                name_error = False
        if row["address"] is None or row["address"] == "":
            address_error = True
            address_error_message = "Address cannot be empty."
        else:    
            location_arr = geocode_address(row["address"])
            if location_arr[0]["lat"] is None or location_arr[0]["lng"] is None:
                address_error = True
                address_error_message = "Address is not valid."
            else:
                # check if address is 150 char limit
                if len(row["address"]) > 150:
                    address_error = True
                    address_error_message = "Address cannot be more than 150 characters."
                else:
                    address_error = False
        if row["phone_number"] is None or row["phone_number"] == "":
            phone_number_error = True
            phone_number_error_message = "Phone number cannot be empty."
        else:
            # need to check if phone number limit is 18 chars
            if len(row["phone_number"]) > 18:
                # error with phone number
                phone_number_error = True
                phone_number_error_message = "Phone number cannot be more than 18 characters."
            else:
                phone_number_error = False
        if address_error or phone_number_error or name_error or email_error:
            error_message = {"row_num": row_num, "name": name_error_message, "email": email_error_message, "address": address_error_message, "phone_number": phone_number_error_message}
            error_obj = {"row_num" : row_num, "name": name_error, "email": email_error, "address": address_error, "phone_number": phone_number_error, "duplicate_email": False, "duplicate_name": False, "error_message": error_message}
            errors.append(error_obj)
            errors_msg.append(error_message)
        else:
            error_message = {"row_num": row_num, "name": name_error_message, "email": email_error_message, "address": address_error_message, "phone_number": phone_number_error_message}
            error_obj = {"row_num" : row_num, "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": False, "error_message": error_message}
        row_obj = {"row_num" : row_num, "name": row["name"], "email": row["email"], "address": row["address"], "phone_number": row["phone_number"], "error": error_obj, "exclude": False}
        users.append(row_obj)
        row_num += 1


    if len(users) == 0:
        data["users"] = {}
        data["success"] = False
        return Response(data, status=404)


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

    data["users"] = users
    data["errors"] = errors
    data["success"] = True
    bulk_import_file_save(FILENAME, data)
    return Response(data)





    
