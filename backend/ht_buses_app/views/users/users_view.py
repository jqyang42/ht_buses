from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ...serializers import UserSerializer


# User GET API: All Users for Admin
# Cut down on code
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny]) 
def users(request):
    data = {}
    users = User.objects.all()
    # COMMENTED OUT CODE FOR PAGINATION
    # page_number = request.query_params["page"]
    # # For now I will retrieve 10 records for each page request, can be changed
    # if int(page_number) == 1:
    #     users = User.objects.all()[:10*int(page_number)]
    # else:
    #     users = User.objects.all()[1+10*(int(page_number)-1):10*int(page_number)]
    user_serializers = UserSerializer(users, many=True)
    users_arr = []
    for user in user_serializers.data:
        id = user["id"]
        first_name = user["first_name"]
        last_name = user["last_name"]
        email = user["email"]
        is_staff = user["is_staff"]
        is_parent = user["is_parent"]
        address = user["address"]
        if user["lat"] == None:
            lat = 0
        else:
            lat = user["lat"]
        if user["long"] == None:
            long = 0
        else:
            long = user["long"]
        users_arr.append({'id' : id, 'first_name' : first_name, 'last_name' : last_name, 'email' : email, 'is_staff' : is_staff, 'is_parent' : is_parent, 'address' : address, 'lat' : lat, 'long': long})
    data["users"] = users_arr
    return Response(data)