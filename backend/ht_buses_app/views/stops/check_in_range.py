from ...models import Stop, Route, User, Location, Student
from ...serializers import LocationSerializer, StopSerializer, StudentSerializer, UserSerializer
import math


def update_students_in_range(student_route_id):
    students = Student.studentsTable.filter(route_id=student_route_id)
    students_serializer = StudentSerializer(students, many=True)
    for student in students_serializer.data:
        student_obj = Student.studentsTable.get(pk=student["id"])
        if len(check_student_in_range(student["user_id"], student_route_id)) != 0:
            student_obj.in_range = True
            student_obj.save()
        else:
            student_obj.in_range = False
            student_obj.save()


def check_student_in_range(user_id, student_route_id):
    stops_arr = []
    user = User.objects.get(pk=user_id)
    user_serializer = UserSerializer(user, many=False)
    location = Location.objects.get(pk=user_serializer.data["location"])
    if student_route_id != 0 and student_route_id is not None :
        route = Route.objects.get(pk=student_route_id)
        stops = Stop.stopTables.filter(route_id=route)
        stops_serializer = StopSerializer(stops, many=True)
        for stop in stops_serializer.data:
            stop_location = Location.objects.get(pk=stop["location_id"])
            stop_lat = stop_location.lat / (180/math.pi)
            stop_lng = stop_location.lng / (180/math.pi)
            student_lat = location.lat / (180/math.pi)
            student_lng = location.lng / (180/math.pi)
            dlng = stop_lng - student_lng
            dlat = stop_lat - student_lat
            a = math.sin(dlat / 2)**2 + math.cos(student_lat) * math.cos(stop_lat) * math.sin(dlng/2)**2
            c = 2 * math.asin(math.sqrt(a))
            r = 6371
            dist = c * r
            if dist <= 0.4828032:
                stops_arr.append(stop_format(stop))
    return stops_arr

def stop_format(stop):
    location = Location.objects.get(pk=stop["location_id"])
    location_serializer = LocationSerializer(location, many=False)
    location_arr = {"id": location_serializer.data["id"], "lat": location_serializer.data["lat"], "lng": location_serializer.data["lng"]}
    stop_form = {"id": stop["id"], "name": stop["name"], "arrival": stop["arrival"][:-3], 
    "departure": stop["departure"][:-3], "order_by": stop["order_by"], "location": location_arr
    }
    return stop_form