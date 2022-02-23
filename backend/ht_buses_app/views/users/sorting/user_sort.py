from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ....models import School, Location, Route, Student, User
from django.core.paginator import Paginator
from ....serializers import SchoolSerializer, UserSerializer, RouteSerializer, StudentSerializer, LocationSerializer
from django.contrib.postgres.search import SearchVector, SearchQuery
from django.db.models import Count
from urllib.parse import unquote

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny]) 
def user_sort(request):
    order_by = request.query_params["order_by"] # Name, Route, School, Bus Stop, Parent Name
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    page_num = request.query_params["page"]
    search = request.query_params["q"]
    print(search)
    # alphabetical sort
    if sort_by == "name" or sort_by == "email" or sort_by == "is_staff" or sort_by == "address":
        data = alphabetical_sort(order_by, sort_by, page_num, search)
    return Response(data)

def alphabetical_sort(order_by, sort_by, page_number, search):
    data = {}
    if sort_by == "name":
        if order_by == "asc":
            if search != None:
                users = User.objects.all().order_by("first_name").annotate(search=SearchVector("first_name", "last_name","email")).filter(search__icontains=search)
            else:
                print("do we enter here")
                users = User.objects.all().order_by("first_name")
        else:
            if search != None:
                users = User.objects.all().order_by("-first_name").annotate(search=SearchVector("first_name", "last_name","email")).filter(search__icontains=search)
            else:
                users = User.objects.all().order_by("-first_name")
    if sort_by == "email":
        if order_by == "asc":
            if search != None:
                users = User.objects.all().order_by("email").annotate(search=SearchVector("first_name", "last_name","email")).filter(search__icontains=search)
            else:
                users = User.objects.all().order_by("email")
        else:
            if search != None:
                users = User.objects.all().order_by("-email").annotate(search=SearchVector("first_name", "last_name","email")).filter(search__icontains=search)
            else:
                users = User.objects.all().order_by("-email")
    if sort_by == "is_staff":
        if order_by == "asc":
            if search != None:
                users = User.objects.all().order_by("-is_staff").annotate(search=SearchVector("first_name", "last_name","email")).filter(search__icontains=search)
            else:
                users = User.objects.all().order_by("-is_staff")
        else:
            if search != None:
                users = User.objects.all().order_by("is_staff").annotate(search=SearchVector("first_name", "last_name","email")).filter(search__icontains=search)
            else:
                users = User.objects.all().order_by("is_staff")
    if sort_by == "address":
        if order_by == "asc":
            if search != None:
                users = User.objects.all().order_by("location__address").annotate(search=SearchVector("first_name", "last_name","email")).filter(search__icontains=search)
            else:
                users = User.objects.all().order_by("location__address")
        else:
            if search != None:
                users = User.objects.all().order_by("-location__address").annotate(search=SearchVector("first_name", "last_name","email")).filter(search__icontains=search)
            else:
                users = User.objects.all().order_by("-location__address")
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
        location = Location.locationTables.get(pk=user["location"])
        location_serializer = LocationSerializer(location, many=False)
        location_arr = location_serializer.data
        users_arr.append({'id' : id, 'first_name' : first_name, 'last_name' : last_name, 'email' : email, 'is_staff' : is_staff, 'is_parent' : is_parent, 'location' : location_arr})
    data["users"] = users_arr
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data