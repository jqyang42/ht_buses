from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ....models import User, Student
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 
from ..user_pagination import user_pagination
from ....role_permissions import IsAdmin, IsSchoolStaff, IsDriver

# This only gets users for 1 school, need this somehow to get multiple
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def user_school_view(request):
    order_by = request.query_params["order_by"]
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    page_num = request.query_params["page"]
    search = request.query_params["q"]
    id = request.query_params["id"] # School id
    data = get_user_view(order_by, sort_by, page_num, search, id)
    return Response(data)

def get_user_view(order_by, sort_by, page_number, search, id):
    data = {}
    users = user_search_and_sort(sort_by, order_by, search, id)
    data = user_pagination(users, page_number)
    return data

def user_search_and_sort(sort_by, order_by, search, id):
    # sort type
    if sort_by == "name":
        sort_by = "first_name"
    if sort_by == "address":
        sort_by = "location__address"

    # grab students that have that school
    user_id = Student.objects.filter(school_id=id).values_list('user_id', flat=True)

    # search only
    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        users = User.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
    .filter(Q(pk__in=user_id), Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search)).order_by("id")
    # search and sort or sort only
    else:
        if order_by == "asc":
            if search != None:
                users = User.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(pk__in=user_id), (Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search))).order_by(sort_by)
            else:
                users = User.objects.filter(pk__in=user_id).order_by(sort_by)
        else:
            if search != None:
                users = User.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(pk__in=user_id), (Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search))).order_by("-" + sort_by)
            else:
                users = User.objects.filter(pk__in=user_id).order_by("-" + sort_by)
    return users
