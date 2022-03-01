from django.core.paginator import Paginator
from ...models import Location
from ...serializers import UserSerializer, LocationSerializer
from django.db.models.functions import Concat 


def user_pagination(users, page_number):
    data = {}
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