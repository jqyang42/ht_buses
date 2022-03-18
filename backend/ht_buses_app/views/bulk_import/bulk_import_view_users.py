from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ...role_permissions import IsAdmin
from ...google_funcs import geocode_address
from rest_framework.response import Response
from io import StringIO
from .bulk_import_file_manage import bulk_import_file_save, bulk_import_file_read
import csv
import re

# Bulk import temporary file name
FILENAME = 'bulk_import_users_temp.json'

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin]) 
def bulk_import(request):
    req_file = request.FILES["bulk_users"]
    csv_file = StringIO(req_file.read().decode('latin-1'))
    data = {}
    users = []
    errors = []
    row_num = 1
    # regex
    file_regex = r'.*\.csv$'
    # check file type: send error
    if re.fullmatch(file_regex, req_file.name) is None:
        data["users"] = {}
        data["success"] = False
        return Response(data, status=404)
    reader = csv.reader(csv_file)
    # skip the header
    next(reader, None)
    for row in reader:
        # email, name, address, phone_number
        if row[0] is None:
            email_error = True
        else:
            # TODO: need to have check for duplicates
            if len(row[0]) > 254:
                email_error = True
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, row[0]):
                    email_error = False
                    users_obj = User.objects.filter(email=row[0])
                    if len(users_obj) == 0:
                        email_error = False
                    else:
                        email_error = True
        if row[1] is None:
            name_error = True
        else:
            # check if name is 150 char limit
            if len(row[1]) > 150:
                name_error = True
            else:
                name_error = False
        
        location_arr = geocode_address(row[2])
        if location_arr[0]["lat"] is None or location_arr[0]["lng"] is None:
            address_error = True
        else:
            # check if address is 150 char limit
            if len(row[2]) > 150:
                address_error = True
            else:
                address_error = False
        if row[3] is None:
            phone_number_error = True
        else:
            # need to check if phone number limit is 18 chars
            if len(row[3]) > 18:
                # error with phone number
                phone_number_error = True
            else:
                phone_number_error = False
        if address_error or phone_number_error or name_error or email_error:
            error_obj = {"row_num" : row_num, "name": name_error, "email": email_error, "address": address_error, "phone_number": phone_number_error}
            errors.append(error_obj)
        else:
            error_obj = {}
        row_obj = {"row_num" : row_num, "name": row[1], "email": row[0], "address": row[2], "phone_number": row[3], "error": error_obj}
        users.append(row_obj)
        row_num += 1
    if len(users) == 0:
        data["users"] = {}
        data["success"] = False
        return Response(data, status=404)
    bulk_import_file_save(FILENAME, users)
    data["users"] = users
    data["errors"] = errors
    data["success"] = True
    return Response(data)





    
