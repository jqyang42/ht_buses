from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from rest_framework.response import Response
from ..bulk_import_file_manage import bulk_import_file_delete

# Bulk import temporary file name
FILENAME = 'bulk_import_users_temp_'
JSON_EXTENSION = '.json'

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def bulk_import_temp(request):
    data = {}
    try:
        full_file = FILENAME + request.query_params["token"] + JSON_EXTENSION
        bulk_import_file_delete(full_file)
        data["success"] = True
    except:
        data["success"] = False
    return Response(data)





    
