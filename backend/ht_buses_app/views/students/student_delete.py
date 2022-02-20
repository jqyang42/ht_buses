from ...models import Student, User, Route
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...serializers import StudentSerializer
from ..routes import route_check_is_complete

# Student DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def student_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        student_object =  Student.studentsTable.get(pk=id)
        student_serializer = StudentSerializer(student_object, many=False)
        route_id = student_serializer.data["route_id"]
        parent = User.objects.get(pk = student_object.user_id.id)
        if(Student.studentsTable.filter(user_id = parent).count() == 1):
            parent.is_parent = False
        student_object.delete()
        parent.save()
        if route_id != None:
            route = Route.routeTables.get(pk=route_id)
            is_complete = route_check_is_complete.route_is_complete(route_id)
            route.is_complete = is_complete
            route.save()
        data["message"] = "student successfully deleted"
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "student could not be deleted"
        data["success"] = False
        return Response(data, status = 400)