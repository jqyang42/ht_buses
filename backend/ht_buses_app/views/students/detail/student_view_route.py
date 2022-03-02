from ....models import Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ..student_pagination import student_pagination

# Students Table: Route Detail GET API
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def students_route(request):
    data = {}
    page_number = request.query_params["page"]
    route_id = request.query_params["id"]
    students = Student.objects.filter(route_id=route_id).order_by("id")
    data = student_pagination(students, page_number)
    return Response(data)