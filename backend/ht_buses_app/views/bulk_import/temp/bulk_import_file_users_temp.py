from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ....role_permissions import IsAdmin, IsSchoolStaff
from rest_framework.response import Response
from ..bulk_import_file_manage import bulk_import_file_delete

# Bulk import temporary file name
FILENAME = 'bulk_import_users_temp.json'

# Bulk Import POST API: Checking for Users
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def bulk_import_temp(request):
    data = {}
    try:
        bulk_import_file_delete(FILENAME)
        data["success"] = True
    except:
        data["success"] = False
    return Response(data)





    
