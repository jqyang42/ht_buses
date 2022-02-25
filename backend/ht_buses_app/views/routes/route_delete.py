from ...models import Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

# Routes DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def route_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        route_object =  Route.routeTables.get(pk=id)
        students = Student.studentsTable.filter(route_id=route_object)
        for student in students:
            student.in_range = False
            student.save()
        route_object.delete()
        data["message"] = "route successfully deleted"
        data["success"] = True
        return Response(data)
    except BaseException as e:
        data["message"] = "route could not be deleted"
        data["success"] = False
        return Response(data, status = 400)