from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...models import User
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 
from .user_pagination import user_pagination
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ..general.general_tools import get_users_for_user

# Basically we can use this api just for search by sending order_by/sort_by to be none
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def user_view(request):
    order_by = request.query_params["order_by"] # Name, Route, School, Bus Stop, Parent Name
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    page_num = request.query_params["page"]
    search = request.query_params["q"]
    user_list = get_users_for_user(request.user)
    data = get_user_view(order_by, sort_by, page_num, search, user_list)
    return Response(data)

def get_user_view(order_by, sort_by, page_number, search, user_list):
    data = {}
    users = user_search_and_sort(sort_by, order_by, search, user_list)
    data = user_pagination(users, page_number)
    return data

def user_search_and_sort(sort_by, order_by, search, user_list):
    # sort type
    if sort_by == "name":
        sort_by = "first_name"
    if sort_by == "address":
        sort_by = "location__address"
    users = user_list
    # search only
    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        users = user_list.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
    .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search)).order_by("id")
    # search and sort or sort only
    else:
        if order_by == "asc":
            if search != None and search != "":
                users = user_list.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search)).order_by(sort_by)
            elif sort_by == "role":
                print("sort by role") #TODO: FIX sorting with role
            else:
                users = user_list.order_by(sort_by)
        else:
            if search != None and search != "":
                users = user_list.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search)).order_by("-" + sort_by)
            elif sort_by == "role":
                print("sort by role")
            else:
                users = user_list.order_by("-" + sort_by)
    return users
