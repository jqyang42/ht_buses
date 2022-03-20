from ...models import Student, User, Route
from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...serializers import StudentSerializer
from ..routes import route_check_is_complete
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import get_object_for_user, update_schools_staff_rights
from ..general import response_messages


# Student DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdmin|IsSchoolStaff])
def student_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        student_object =  Student.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "student")
    try:
        student_school = get_object_for_user(request.user, student_object.school_id, "change_school")
    except: 
        return response_messages.PermissionDenied(data, "student")
    try:
        student_serializer = StudentSerializer(student_object, many=False)
        route_id = student_serializer.data["route_id"]
        parent = User.objects.get(pk = student_object.user_id.id)
        #if(Student.objects.filter(user_id = parent).count() == 1): #parent.is_parent = False
        student_object.delete()
        parent.save()
        update_schools_staff_rights()
        if route_id != None:
            route = Route.objects.get(pk=route_id)
            is_complete = route_check_is_complete.route_is_complete(route_id)
            route.is_complete = is_complete
            route.save()
        data["message"] = "student successfully deleted"
        data["success"] = True
        return Response(data)
    except:
       return response_messages.UnsuccessfulAction(data, "student delete")