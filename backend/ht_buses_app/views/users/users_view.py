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
from ..general.general_tools import get_users_for_user, get_role_string, get_users_with_address

# Basically we can use this api just for search by sending order_by/sort_by to be none
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def user_view(request):
    order_by = request.query_params["order_by"] # Name, Route, School, Bus Stop, Parent Name
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    page_num = request.query_params["page"]
    search = request.query_params["q"]
    role = request.query_params["role"]
    user_list = get_users_for_user(request.user)
    data = get_user_view(order_by, sort_by, page_num, search, role, user_list)
    return Response(data)

def get_user_view(order_by, sort_by, page_number, search, role, user_list):
    data = {}
    users = user_search_and_sort(sort_by, order_by, search, role, user_list)
    data = user_pagination(users, page_number)
    return data

def user_search_and_sort(sort_by, order_by, search, role, user_list):
    # sort type
    if sort_by == "name":
        sort_by = "full_name"
    if sort_by == "address":
        sort_by = "location__address"
    if role == "1" or role == "2" or role == "3" or role == "4" or role == "5":
        role = int(role)
    users = user_list
    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        if role == 1 or role == 2 or role == 3 or role == 4 or role == 5:
            users = user_list.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
    .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains=search), role=role).order_by("id")
        else:
            users = user_list.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
    .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains=search)).order_by("id")
    # search and sort or sort only
    else:
        if order_by == "asc":
            if search != None or search != "":
                if role == 1 or role == 2 or role == 3 or role == 4 or role == 5:
                    if sort_by == "role":
                        users = sorted_by_role_type(user_list.filter(role=role))
                    else:
                        users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search), role=role).order_by(sort_by)
                else:
                    users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search))
                    if sort_by == "role":
                        users = sorted_by_role_type(users)
                    else:
                        users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name')).order_by(sort_by)
            elif sort_by == "role":
                users = sorted_by_role_type(user_list)
            else:
                if role == 1 or role == 2 or role == 3 or role == 4 or role == 5:
                    users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name')).filter(role=role).order_by(sort_by)
                else:
                    users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name')).order_by(sort_by)
        else:
            if search != None and search != "":
                if role == 1 or role == 2 or role == 3 or role == 4 or role == 5:
                    if sort_by == "role":
                        users = sorted_by_role_type(user_list.filter(role=role), True)
                    else:
                        users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name')).filter(role=role).order_by("-" + sort_by)
                else:
                    if int(role) == 1 or int(role) == 2 or int(role) == 3 or int(role) == 4 or int(role) == 5:
                        users = user_list.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search)).filter(role=role)
                    else:
                        users = user_list.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search))
                    if sort_by == "role":
                        users = sorted_by_role_type(users, True)
                    else:
                        users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name')).order_by("-" + sort_by)
            elif sort_by == "role":
                if role == 1 or role == 2 or role == 3 or role == 4 or role == 5:
                    users = sorted_by_role_type(user_list.filter(role=role), True)
                else:
                    users = sorted_by_role_type(user_list, True)
            else:
                if role == 1 or role == 2 or role == 3 or role == 4 or role == 5:
                    users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name')).filter(role=role).order_by("-" + sort_by)
                else:
                    users = users.annotate(full_name=Concat('first_name', V(' '), 'last_name')).order_by("-" + sort_by)
    return users

def sorted_by_role_type(user_list, desc= False):
    return sorted(user_list, key=lambda user: get_role_string(user.role), reverse=desc)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def users_with_address(request):
    user_list = get_users_with_address(request.user).order_by("first_name")
    data = user_pagination(user_list, 0)
    return Response(data)
