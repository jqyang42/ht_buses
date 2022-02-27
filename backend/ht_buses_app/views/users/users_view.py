from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...models import Location, User
from django.core.paginator import Paginator
from ...serializers import UserSerializer, LocationSerializer
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 

# Basically we can use this api just for search by sending order_by/sort_by to be none
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny]) 
def user_view(request):
    order_by = request.query_params["order_by"] # Name, Route, School, Bus Stop, Parent Name
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    page_num = request.query_params["page"]
    search = request.query_params["q"]
    data = get_user_view(order_by, sort_by, page_num, search)
    return Response(data)

def get_user_view(order_by, sort_by, page_number, search):
    data = {}
    users = user_search_and_sort(sort_by, order_by, search)
    # pagination starts here
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        user_serializer = UserSerializer(users, many=True)
    else:
        paginator = Paginator(users, 10) # Show 10 per page
        users_per_page = paginator.get_page(page_number)
        total_page_num = paginator.num_pages
        user_serializer = UserSerializer(users_per_page, many=True)
        if int(page_number) == 1 and int(page_number) == total_page_num:
            prev_page = False
            next_page = False
        elif int(page_number) == 1:
            prev_page = False
            next_page = True
        else:
            prev_page = True
            if int(page_number) == total_page_num:
                next_page = False
            else:
                next_page = True
    users_arr = []
    for user in user_serializer.data:
        id = user["id"]
        first_name = user["first_name"]
        last_name = user["last_name"]
        email = user["email"]
        is_staff = user["is_staff"]
        is_parent = user["is_parent"]
        location = Location.objects.get(pk=user["location"])
        location_serializer = LocationSerializer(location, many=False)
        location_arr = location_serializer.data
        users_arr.append({'id' : id, 'first_name' : first_name, 'last_name' : last_name, 'email' : email, 'is_staff' : is_staff, 'is_parent' : is_parent, 'location' : location_arr})
    data["users"] = users_arr
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data

def user_search_and_sort(sort_by, order_by, search):
    # sort type
    if sort_by == "name":
        sort_by = "first_name"
    if sort_by == "address":
        sort_by = "location__address"

    # search only
    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        users = User.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
    .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search)).order_by("id")
    # search and sort or sort only
    else:
        if order_by == "asc":
            if search != None:
                users = User.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search)).order_by(sort_by)
            else:
                users = User.objects.all().order_by(sort_by)
        else:
            if search != None:
                users = User.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains = search)).order_by("-" + sort_by)
            else:
                users = User.objects.all().order_by("-" + sort_by)
    return users
