from ....serializers import LogSerializer
from ....models import User, Route, Log
from rest_framework.response import Response
import json
from datetime import datetime, date, timezone
from ....role_permissions import IsAdmin, IsDriver
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 
from ..log_view import get_log_view

# Added IsAdmin so I can test on Postman so I don't have to switch to being a driver
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsDriver|IsAdmin]) 
def log_route_view(request):
    id = request.query_params["id"]
    page_number = request.query_params["page"]
    sort_by = request.query_params["sort_by"]
    order_by = request.query_params["order_by"]
    search = request.query_params["q"]
    log_list = Log.objects.filter(route_id=id)
    data = get_log_view(page_number, order_by, sort_by, search, log_list)
    return Response(data)