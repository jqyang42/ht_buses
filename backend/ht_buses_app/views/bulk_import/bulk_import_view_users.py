from ...models import School, Location
from ...serializers import LocationSerializer, SchoolSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ...role_permissions import IsAdmin
import csv
from ...google_funcs import geocode_address
from rest_framework.response import Response
import re

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin]) 
def bulk_import(request):
    req_file = request.FILES
    page_number = request.query_params["page"]
    errors = []
    data = []
    users = []
    row_num = 1
    reader = csv.reader(req_file)
    # skip the header
    next(reader, None)
    for row in reader:
        # email, name, address, phone_number
        if row[0] is None:
            email_error = True
        else:
            # TODO: need email already exists in system
            # TODO: need to have check for duplicates
            if len(row[0]) > 254: # make models for email char higher
                email_error = True
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, row[0]):
                    email_error = False
                else:
                    email_error = True
        if row[1] is None:
            name_error = True
        else:
            # check if name is 150 char limit, add to db
            if len(row[1]) > 150:
                name_error = True
            else:
                name_error = False
        
        location_arr = geocode_address(row[2])
        if location_arr[0]["lat"] is None or location_arr[0]["lng"] is None:
            address_error = True
        else:
            # check if address is 150 char limit, add to db
            if len(row[2]) > 150:
                address_error = True
            else:
                address_error = False
        if row[3] is None:
            phone_number_error = True
        else:
            # need to check if phone number limit is 18 chars (need to make phone number char higher)
            if len(row[3]) > 18: # phone number char needs to be 18
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
    total_page_num = len(users) // 10 + (len(users) % 10 > 0)
    if int(page_number) == 1 and int(page_number) == total_page_num:
        prev_page = False
        next_page = False
    elif int(page_number) == 1:
        prev_page = False
        next_page = True
    else:
        prev_page = True
        if int(page_number) == total_page_num:
            next_page = False
        else:
            next_page = True
    # we need to grab a certain number of users
    if int(page_number) == 1:
        pag_users = users[:10*int(page_number)]
    else:
        pag_users = users[(1+10*(int(page_number)-1)):10*int(page_number)]
    data["users"] = pag_users
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return Response(data)





    
