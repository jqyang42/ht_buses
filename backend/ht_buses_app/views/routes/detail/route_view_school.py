from ....models import School, Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ....serializers import StudentSerializer, RouteSerializer, SchoolSerializer
from django.core.paginator import Paginator
from ..route_pagination import route_pagination
from ....role_permissions import IsAdmin, IsSchoolStaff

# Routes GET API: All Routes View for Admin
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff])
def routes_school(request):
    data = {}
    page_number = request.query_params["page"]
    school_id = request.query_params["id"]
    routes = Route.objects.filter(school_id=school_id).order_by("id")
    data = route_pagination(routes, page_number)
    return Response(data)