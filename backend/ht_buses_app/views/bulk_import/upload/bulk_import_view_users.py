from ....models import User, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from ....google_funcs import geocode_address
from rest_framework.response import Response
from ....serializers import UserSerializer, LocationSerializer, BulkImportUserSerializer
from io import StringIO
from ..bulk_import_file_manage import bulk_import_file_save, generate_unique_token
import csv
import re
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 
from guardian.shortcuts import get_objects_for_user

# Bulk import temporary file name
FILENAME = 'bulk_import_users_temp_'
JSON_EXTENSION = '.json'

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def bulk_import(request):
    req_file = request.FILES["bulk_users"]
    csv_file = StringIO(req_file.read().decode('utf-8-sig'))
    data = {}
    users = []
    errors = []
    errors_msg = []
    row_num = 1
    email_error_message = ""
    phone_number_error_message = ""
    name_error_message = ""
    address_error_message = ""
    users_token = generate_unique_token()
    headers = ["email", "name", "address", "phone_number"]
    # regex
    file_regex = r'.*\.csv$'
    # check file type: send error
    if re.fullmatch(file_regex, req_file.name) is None:
        print("is not a csv")
        data["users"] = {}
        data["success"] = False
        return Response(data, status=404)
    reader = csv.DictReader(csv_file, delimiter=',')
    header_csv = reader.fieldnames
    
    if len(header_csv) == len(headers):
        if header_csv[0] != headers[0] or header_csv[1] != headers[1] or header_csv[2] != headers[2] or header_csv[3] != headers[3]:
            data["users"] = {}
            data["success"] = False
            return Response(data, status=404)
    else:
        data["users"] = {}
        data["success"] = False
        return Response(data, status=404)

    # skip the header
    #next(reader, None)
    for row in reader:
        exclude = False
        existing_users = []
        # email, name, address, phone_number
        if row["email"] is None or row["email"] == "":
            email_error = True
            email_error_message = "Email field cannot be empty"
        else:
            # TODO: need to have check for duplicates
            if len(row["email"]) > 254:
                email_error = True
                email_error_message = "Email is over 254 character limit"
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, row["email"]):
                    email_error = False
                    # Need permissions
                    #users_perm = get_objects_for_user(request.users, "view_user", User.objects.all())
                    users_obj = User.objects.filter(email=row["email"])
                    if len(users_obj) == 0:
                        email_error = False
                    else:
                        print(users_obj)
                        user_serializer = UserSerializer(users_obj, many=True)
                        location = Location.objects.get(pk=user_serializer.data[0]["location"])
                        location_serializer = LocationSerializer(location, many=False)
                        first_name = user_serializer.data[0]["first_name"]
                        last_name = user_serializer.data[0]["last_name"]
                        address = location_serializer.data["address"]
                        if address == None or address == "":
                            address_str = ""
                            no_address = "no"
                        else:
                            address_str = address
                            no_address = ""
                        phone_number = user_serializer.data[0]["phone_number"]
                        email_error_message = "Email already exists in the system as " + first_name + " " + last_name + " with " + no_address  + " address " + address_str + " and phone number " + phone_number
                        email_error = True
                        exclude = True
                else:
                    email_error = True
                    email_error_message = "User email is not a valid email"
        if row["name"] is None or row["name"] == "":
            name_error = True
            name_error_message = "Name field cannot be empty"
        else:
            # check if name is 150 char limit
            if len(row["name"]) > 150:
                name_error = True
                name_error_message = "Name cannot be more that 150 characters"
            else:
                # check if name is part of an existing user tears
                #users_name_perm = get_objects_for_user(request.users, "view_user", User.objects.all())
                users_names = User.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__iexact=row["name"]) | Q(first_name__iexact=row["name"]) | Q(last_name__iexact=row["name"]))
                print(users_names)
                if len(users_names) == 0:
                    # do check if name is missing last name
                    missing_last_name = row["name"].split(" ", 1)
                    if len(missing_last_name) < 2:
                        name_error = True
                        name_error_message = "Name is missing last name field"
                    else:
                        name_error = False
                else:
                    user_name_serializer = BulkImportUserSerializer(users_names, many=True)
                    user_name_arr = []
                    for i in range(0, len(user_name_serializer.data)):
                        user_name_first_name = user_name_serializer.data[i]["first_name"]
                        user_name_last_name = user_name_serializer.data[i]["last_name"]
                        user_name_location = user_name_serializer.data[i]["location"]
                        user_name_phone_number = user_name_serializer.data[i]["phone_number"]
                        user_name_email = user_name_serializer.data[i]["email"]
                        user_location = Location.objects.get(pk=user_name_location)
                        user_name_location_serializer = LocationSerializer(user_location, many=False)
                        user_name_address = user_name_location_serializer.data["address"]
                        user_name_arr.append({"id": user_name_serializer.data[i]["id"], "first_name": user_name_first_name, "last_name": user_name_last_name, "address": user_name_address, "email": user_name_email, "phone_number": user_name_phone_number})
                    existing_users = user_name_arr
                    name_error = True
                    name_error_message= "Name may already exist in the system"
                    exclude = True

        if row["address"] is None or row["address"] == "":
            address_error = True
            address_error_message = "Address cannot be empty"
        else:    
            location_arr = geocode_address(row["address"])
            if location_arr is None or len(location_arr) == 0:
                address_error = True
                address_error_message = "Address is not valid"
            else:
                # check if address is 150 char limit
                if len(row["address"]) > 150:
                    address_error = True
                    address_error_message = "Address cannot be more than 150 characters"
                else:
                    address_error = False
        if row["phone_number"] is None or row["phone_number"] == "":
            phone_number_error = True
            phone_number_error_message = "Phone number cannot be empty"
        else:
            # need to check if phone number limit is 18 chars
            if len(row["phone_number"]) > 18:
                # error with phone number
                phone_number_error = True
                phone_number_error_message = "Phone number cannot be more than 18 characters"
            else:
                phone_number_error = False
        if address_error or phone_number_error or name_error or email_error:
            error_message = {"row_num": row_num, "name": name_error_message, "email": email_error_message, "address": address_error_message, "phone_number": phone_number_error_message}
            error_obj = {"row_num" : row_num, "name": name_error, "email": email_error, "address": address_error, "phone_number": phone_number_error, "duplicate_email": False, "duplicate_name": False, "error_message": error_message, "existing_users": existing_users, "exclude": False}
            errors.append(error_obj)
            errors_msg.append(error_message)
        else:
            error_message = {"row_num": row_num, "name": name_error_message, "email": email_error_message, "address": address_error_message, "phone_number": phone_number_error_message}
            error_obj = {"row_num" : row_num, "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": False, "error_message": error_message, "existing_users": existing_users, "exclude": False}
        row_obj = {"row_num" : row_num, "name": row["name"], "email": row["email"], "address": row["address"], "phone_number": row["phone_number"], "error": error_obj, "exclude": False}
        users.append(row_obj)
        users[row_num-1]["exclude"] = exclude

        row_num += 1


    if len(users) == 0:
        print("nothing was processed aka empty file")
        data["users"] = {}
        data["success"] = False
        return Response(data, status=404)


    for i in range(0, len(users)):
        for j in range(i + 1, len(users)):
            user_i_name = ' '.join(users[i]["name"].strip().split()).casefold()
            user_j_name = ' '.join(users[j]["name"].strip().split()).casefold()

            user_i_email = users[i]["email"].strip().casefold()
            user_j_email = users[j]["email"].strip().casefold()

            if user_i_name == user_j_name and user_i_email == user_j_email:
                users[i]["error"]["duplicate_name"] = True
                users[j]["error"]["duplicate_name"] = True
                users[i]["error"]["duplicate_email"] = True
                users[j]["error"]["duplicate_email"] = True
                users[i]["exclude"] = True
                users[j]["exclude"] = True
                if len(errors) == 0:
                    new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": True, "error_message": [], "existing_users": existing_users, "exclude": False}
                    new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": True, "error_message": [], "existing_users": existing_users, "exclude": False}
                    errors.append(new_error)
                    errors.append(new_errors)
                else:
                    user_i_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == users[i]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            errors[k]["duplicate_email"] = True
                            user_i_found = True
                    if user_i_found == False:
                        new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": True, "error_message": [], "existing_users": existing_users, "exclude": False}
                        errors.append(new_errors)

                    user_j_found = False  
                    for k in range(0, len(errors)):    
                        if errors[k]["row_num"] == users[j]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            errors[k]["duplicate_email"] = True
                            user_j_found = True
                    if user_j_found == False:
                        new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": True, "error_message": [], "existing_users": existing_users, "exclude": False}
                        errors.append(new_error)


            elif user_i_name == user_j_name:
                users[i]["error"]["duplicate_name"] = True
                users[j]["error"]["duplicate_name"] = True
                users[i]["exclude"] = True
                users[j]["exclude"] = True
                if len(errors) == 0:
                    new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": True, "error_message": [], "existing_users": [], "exclude": False}
                    new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": True, "error_message": [], "existing_users": [], "exclude": False}
                    errors.append(new_error)
                    errors.append(new_errors)
                else:
                    user_i_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == users[i]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            user_i_found = True
                    if user_i_found == False:
                        new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": True, "error_message": [], "existing_users": [], "exclude": False}
                        errors.append(new_errors)

                    user_j_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == users[j]["row_num"]:
                            errors[k]["duplicate_name"] = True
                    if user_j_found == False:
                        new_errors = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": False, "duplicate_name": True, "error_message": [], "existing_users": [], "exclude": False}
                        errors.append(new_errors)
            
            elif user_i_email == user_j_email:
                users[i]["error"]["duplicate_email"] = True
                users[j]["error"]["duplicate_email"] = True
                users[i]["exclude"] = True
                users[j]["exclude"] = True
                if len(errors) == 0:
                    new_error = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": False, "error_message": [], "existing_users": [], "exclude": False}
                    new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": False, "error_message": [], "existing_users": [], "exclude": False}
                    errors.append(new_error)
                    errors.append(new_errors)
                else: 
                    user_i_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == users[i]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            user_i_found = True
                    if user_i_found == False:
                        new_errors = {"row_num" : users[i]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": False, "error_message": [], "existing_users": [], "exclude": False}
                        errors.append(new_errors)
                    user_j_found = False
                    for k in range(0, len(errors)):
                        if errors[k]["row_num"] == users[j]["row_num"]:
                            errors[k]["duplicate_name"] = True
                            user_j_found = True
                    if user_j_found == False:
                        new_errors = {"row_num" : users[j]["row_num"], "name": False, "email": False, "address": False, "phone_number": False, "duplicate_email": True, "duplicate_name": False, "error_message": [], "existing_users": [], "exclude": False}
                        errors.append(new_errors)

    data["users"] = users
    data["errors"] = errors
    data["success"] = True
    data["users_token"] = users_token
    bulk_import_file_save(FILENAME + users_token + JSON_EXTENSION, data)
    return Response(data)





    
