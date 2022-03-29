from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import has_access_to_object
from ..general import response_messages
  
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def user_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        uv_user_object =  User.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "user")
    try:
        user_object = has_access_to_object(request.user, uv_user_object)
    except:
        return response_messages.PermissionDenied(data, "user")
    try:
        user_object.location.delete()
        user_object.delete() #need to delete student account for associated students + delete student object if user deleted is student 
        data["message"] = "user successfully deleted"
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "user delete")