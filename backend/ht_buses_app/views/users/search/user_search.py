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
@permission_classes([IsAdminUser]) 
def user_search(request):
    data = {}
    search_q = request.query_params["q"]
    page_number = request.query_params["page"]
    users = User.objects.annotate(search=SearchVector("first_name","last_name","email")).filter(search__icontains=search_q)
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
    return Response(data)