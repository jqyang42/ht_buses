from ...models import School
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.core.exceptions import ValidationError

# Schools DELETE API
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def school_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        school_object =  School.schoolsTable.get(pk=id)
        school_object.delete()
        data["message"] = "school successfully deleted"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "school could not be deleted"})