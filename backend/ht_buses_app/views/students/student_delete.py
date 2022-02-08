from ...models import Student, User
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response

# Student DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def student_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        student_object =  Student.studentsTable.get(pk=id)
        parent = User.objects.get(pk = 40)
        if(Student.studentsTable.filter(user_id = parent).count() == 1):
            parent.is_parent = False
        student_object.delete()
        parent.save()
        data["message"] = "student successfully deleted"
        result = {"data" : data}
        return Response(result)
    except:
        return Response(data, status = 400)
        #raise ValidationError({"messsage": "student could not be deleted"})