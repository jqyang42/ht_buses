from ...serializers import LogSerializer, UserSerializer, RouteSerializer, SchoolSerializer
from django.core.paginator import Paginator
from ...models import User, Route, School

def log_pagination(logs, page_number):
    data = {}
    # how do I do pagination again lmfao
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        log_serializer = LogSerializer(logs, many=True)
    else:
        paginator = Paginator(logs, 10) # Show 10 per page
        users_per_page = paginator.get_page(page_number)
        total_page_num = paginator.num_pages
        log_serializer = LogSerializer(users_per_page, many=True)
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
    log_arr = []
    for log in log_serializer.data:
        route = Route.objects.get(pk=log["route_id"])
        route_serializer = RouteSerializer(route, many=False)
        route_name = route_serializer.data["name"]
        school = School.objects.get(pk=route_serializer.data["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        bus_number = log["bus_number"]
        user = User.objects.get(pk=log["user_id"])
        user_serializer = UserSerializer(user, many=False)
        user_first_name = user_serializer.data["first_name"]
        user_last_name = user_serializer.data["last_name"]
        user_obj = {"id": user_serializer.data["id"], "first_name": user_first_name, "last_name": user_last_name}
        date = log["date"]
        start_time = log["start_time"]
        duration = log["duration"]
        pickup = log["pickup"]
        log_arr.append({"id": log["id"], "route_name": route_name, "school_name": school_name, "bus_number": bus_number, "user": user_obj, "date": date, "start_time": start_time[:-10], "duration": duration[:-3], "pickup": pickup})

    data["logs"] = log_arr
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data