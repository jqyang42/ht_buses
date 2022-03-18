from ....models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin
from ....google_funcs import geocode_address
from rest_framework.response import Response
import re
import json

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin]) 
# TODO: missing duplicate validation check
def bulk_import_validate(request):
    data = {}
    errors = []
    users = []
    reqBody = json.loads(request.body)
    for user in reqBody["users"]:
        # email, name, address, phone_number
        if user["email"] is None or user["email"] == "":
            email_error = True
        else:
            # TODO: need to have check for duplicates
            if len(user["email"]) > 254:
                email_error = True
            else:
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if re.fullmatch(regex, user["email"]):
                    users_obj = User.objects.filter(email=user["email"])
                    if len(users_obj) == 0:
                        email_error = False
                    else:
                        email_error = True
                else:
                    email_error = True
        if user["name"] is None or user["name"] == "":
            name_error = True
        else:
            # check if name is 150 char limit
            if len(user["name"]) > 150:
                name_error = True
            else:
                name_error = False
        
        location_arr = geocode_address(user["address"])
        if location_arr[0]["lat"] is None or location_arr[0]["lng"] is None:
            address_error = True
        else:
            # check if address is 150 char limit
            if len(user["address"]) > 150:
                address_error = True
            else:
                address_error = False
        if user["phone_number"] is None or user["phone_number"] == "":
            phone_number_error = True
        else:
            # need to check if phone number limit is 18 chars
            if len(user["phone_number"]) > 18:
                # error with phone number
                phone_number_error = True
            else:
                phone_number_error = False
        if address_error or phone_number_error or name_error or email_error:
            error_obj = {"row_num" : user["row_num"], "name": name_error, "email": email_error, "address": address_error, "phone_number": phone_number_error}
            errors.append(error_obj)
        else:
            error_obj = {}
        row_obj = {"row_num" : user["row_num"], "name": user["name"], "email": user["email"], "address": user["address"], "phone_number": user["phone_number"], "error": error_obj}
        users.append(row_obj)
    if len(users) == 0:
        data["users"] = {}
        data["success"] = False
        return Response(data, status=404)
    data["users"] = users
    data["errors"] = errors
    data["success"] = True
    return Response(data)





    
