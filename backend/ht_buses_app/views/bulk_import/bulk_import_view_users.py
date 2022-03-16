from ...models import School, Location
from ...serializers import LocationSerializer, SchoolSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ...role_permissions import IsAdmin
import csv
from ...google_funcs import geocode_address
from rest_framework.response import Response

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin]) 
def bulk_import(request):
    req_file = request.FILES
    page_number = request.query_params["page"]
    error_obj = []
    data = []
    users = []
    row_num = 0
    reader = csv.reader(req_file)
    # skip the header
    next(reader, None)
    for row in reader:
        # email, name, address, phone_number
        # how should I append errors???
        if row[0] is None:
            # how would I show email as an error?
            email = ""
        else:
            email = row[0]
        if row[1] is None:
            name = ""
        else:
            name = row[1].split()
            first_name = name[0]
            last_name = name[1]
        # call google api
        location_arr = geocode_address(row[2])
        if location_arr[0]["lat"] is None or location_arr[0]["lng"] is None:
            # error with address
            address = row[2]
        # need to also check char limit
        if row[3] is None:
            # error with phone number
            phone_number = row[3]
        else:
            phone_number = row[3]
        row_num += 1
        row_obj = {"row_num" : row_num, "name": name, "email": email, "address": address, "phone_number": phone_number}
        users.append(row_obj)
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
    data["users"] = users
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return Response(data)





    
