from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from ...role_permissions import IsAdmin
from rest_framework.response import Response
from .bulk_import_file_manage import bulk_import_file_read

# Bulk import temporary file name
FILENAME = 'bulk_import_users_temp.json'

# Bulk Import GET API: Retrieving Users JSON
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin]) 
def bulk_import(request):
    data = bulk_import_file_read(FILENAME)
    return Response(data)





    
