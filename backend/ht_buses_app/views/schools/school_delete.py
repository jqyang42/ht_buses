from ...models import School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

# Schools DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def school_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        school_object = School.schoolsTable.get(pk=id)
        school_object.delete()
        data["message"] = "school successfully deleted"
        return Response(data)
    except:
        data["message"] = "school could not be deleted"
        return Response(data, status = 400)