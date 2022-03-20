from ...models import Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import has_access_to_object
from ..general import response_messages

# Routes DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def route_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        route_object =  Route.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "route")
    try:
        accessible_school = has_access_to_object(request.user, route_object.school_id)
    except:
        response_messages.PermissionDenied(data, "route's school")
    try:
        students = Student.objects.filter(route_id=route_object)
        for student in students:
            student.in_range = False
            student.save()
        route_object.delete()
        data["message"] = "route successfully deleted"
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "route delete")