from ....models import User, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin
from ....google_funcs import geocode_address
from rest_framework.response import Response
import re
import json

# Bulk Import POST Validate API: Checking for Users
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin]) 
# TODO: missing duplicate validation check
def bulk_import_validate(request):
    data = {}
    reqBody = json.loads(request.body)
    for user in reqBody["users"]:
        # email, name, address, phone_number
        name = user["name"].split()
        first_name = name[0]
        last_name = name[1:]
        location_arr = geocode_address(user["address"])
        location = Location.objects.create(
            address=user["address"],
            lat=location_arr[0]["lat"],
            lng=location_arr[0]["lng"]
        )
        user = User.objects.create(
            first_name = first_name,
            last_name = last_name,
            email = user["email"],
            phone_number = user["phone_number"],
            is_parent = True,
            role = 4,
            location = location
        )
    data["success"] = True
    return Response(data)





    
