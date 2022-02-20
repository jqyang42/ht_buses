from ...models import Stop, Route, User, Location
from ...serializers import StopSerializer, UserSerializer
import math


def check_student_in_range(user_id, student_route_id):
    stops_arr = []
    user = User.objects.get(pk=user_id)
    user_serializer = UserSerializer(user, many=False)
    location = Location.locationTables.get(pk=user_serializer.data["location"])
    route = Route.routeTables.get(pk=student_route_id)
    stops = Stop.stopTables.filter(route_id=route)
    stops_serializer = StopSerializer(stops, many=True)
    for stop in stops_serializer.data:
        stop_location = Location.locationTables.get(pk=stop["location_id"])
        stop_lat = stop_location.lat / (180/math.pi)
        stop_long = stop_location.long / (180/math.pi)
        student_lat = location.lat / (180/math.pi)
        student_long = location.long / (180/math.pi)
        dlng = stop_long - student_long
        dlat = stop_lat - student_lat
        a = math.sin(dlat / 2)**2 + math.cos(student_lat) * math.cos(stop_lat) * math.sin(dlng/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371
        dist = c * r
        if dist <= 0.4828032:
            stops_arr.append(stop)
    return stops_arr