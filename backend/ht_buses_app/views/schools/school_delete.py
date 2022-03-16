from ...models import School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ...role_permissions import IsAdmin
from ..general.general_tools import get_object_for_user
from ..general.response_messages import UnsuccessfulAction

# Schools DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdmin])
def school_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        uv_school_object = School.objects.get(pk=id)
        school_object = get_object_for_user(request.user, uv_school_object, "delete_school")
        school_object.location_id.delete()
        school_object.delete()
        data["message"] = "school successfully deleted"
        data["success"] = True
        return Response(data)
    except:
        return UnsuccessfulAction(data, "school delete")