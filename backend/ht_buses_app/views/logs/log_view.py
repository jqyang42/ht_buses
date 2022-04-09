from rest_framework.response import Response
from datetime import timedelta
from ...role_permissions import IsAdmin, IsDriver, IsSchoolStaff
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, DateTimeField
from django.db.models import Value as V
from django.db.models.functions import Concat, Cast
from ..general.general_tools import get_logs_for_user
from .log_pagination import log_pagination

# Added IsAdmin so I can test on Postman so I don't have to switch to being a driver
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsDriver|IsAdmin|IsSchoolStaff]) 
def log_view(request):
    page_number = request.query_params["page"]
    sort_by = request.query_params["sort_by"]
    order_by = request.query_params["order_by"]
    search = request.query_params["q"]
    active = request.query_params["active"]
    # TODO: Logs need to have permissions --> for school staff only for schools they can see
    logs = get_logs_for_user(request.user)
    if active == "true":
        log_list = logs.filter(duration=timedelta(hours=0))
    else:
        log_list = logs
    data = get_log_view(page_number, order_by, sort_by, search, log_list)
    return Response(data)

def get_log_view(page_number, order_by, sort_by, search, log_list):
    logs = log_search_and_sort(order_by, sort_by, search, log_list)
    data = log_pagination(logs, page_number)
    return data

def log_search_and_sort(order_by, sort_by, search, log_list):
    if sort_by == "user":
        sort_by = "user_id__first_name"
    if sort_by == "route":
        sort_by = "route_id__name"
    if sort_by == "school":
        sort_by = "route_id__school_id__name"
    if sort_by == "start_time":
        sort_by = "date_duration"

    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        logs = log_list.annotate(full_name=Concat('user_id__first_name', V(' '), 'user_id__last_name'), date_duration=Cast(Concat('date', V(" "), 'start_time', output_field=DateTimeField()), output_field=DateTimeField()))\
        .filter(Q(full_name__icontains=search) | Q(user_id__first_name__icontains=search) | Q(user_id__last_name__icontains=search) | Q(route_id__name__icontains = search) | Q(route_id__school_id__name__icontains = search) | Q(bus_number__icontains = search)).order_by("id")
    else:
        if order_by == "asc":
            if search != None:
                logs = log_list.annotate(full_name=Concat('user_id__first_name', V(' '), 'user_id__last_name'), date_duration=Cast(Concat('date', V(" "), 'start_time', output_field=DateTimeField()), output_field=DateTimeField()))\
        .filter(Q(full_name__icontains=search) | Q(user_id__first_name__icontains=search) | Q(user_id__last_name__icontains=search) | Q(route_id__name__icontains = search) | Q(route_id__school_id__name__icontains = search) | Q(bus_number__icontains = search)).order_by(sort_by)
            else:
                logs = log_list.annotate(date_duration=Cast(Concat('date', V(" "), 'start_time', output_field=DateTimeField())), output_field=DateTimeField()).order_by(sort_by)
        else:
            if search != None:
                logs = log_list.annotate(full_name=Concat('user_id__first_name', V(' '), 'user_id__last_name'), date_duration=Cast(Concat('date', V(" "), 'start_time', output_field=DateTimeField()), output_field=DateTimeField()))\
        .filter(Q(full_name__icontains=search) | Q(user_id__first_name__icontains=search) | Q(user_id__last_name__icontains=search) | Q(route_id__name__icontains = search) | Q(route_id__school_id__name__icontains = search) | Q(bus_number__icontains = search)).order_by("-" + sort_by)
            else:
                logs = log_list.annotate(date_duration=Cast(Concat('date', V(" "), 'start_time', output_field=DateTimeField()), output_field=DateTimeField())).order_by("-" + sort_by)
    return logs