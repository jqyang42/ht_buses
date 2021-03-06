from ...models import School, Route
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .route_pagination import route_pagination
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from guardian.shortcuts import get_objects_for_user


# Routes GET API: All Routes View for Admin
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver])
def routes(request):
    data = {}
    page_number = request.query_params["page"]
    order_by = request.query_params["order_by"] # Name, Route, School, Bus Stop, Parent Name
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    search = request.query_params["q"]
    schools = get_objects_for_user(request.user, "view_school", School.objects.values_list('pk', flat=True))
    route_list = Route.objects.filter(school_id__in = schools)
    data = get_routes_view(order_by, sort_by, page_number, search, route_list)
    return Response(data)

def get_routes_view(order_by, sort_by, page_number, search, route_list):
    data = {}
    routes = route_search_and_sort(order_by, sort_by, search, route_list)
    data = route_pagination(routes, page_number)
    return data

def route_search_and_sort(order_by, sort_by, search, route_list):
    if sort_by == "school":
        sort_by = "school_id__name"
    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        routes = route_list.filter(name__icontains=search).order_by("id")
    else:
        if order_by == "asc":
            if search != None:
                routes = route_list.filter(name__icontains=search).order_by(sort_by)
            else:
                routes = route_list.order_by(sort_by)
        else:
            if search != None:
                routes = route_list.filter(name__icontains=search).order_by("-" + sort_by)
            else:
                routes = route_list.order_by("-" + sort_by)
    return routes