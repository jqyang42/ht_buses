from ...models import Route, Student
from ...serializers import StudentSerializer

def route_is_complete(route_id):
    route = Route.objects.get(pk=route_id)
    students = Student.objects.filter(route_id=route)
    students_serializer = StudentSerializer(students, many=True)
    if len(students_serializer.data) == 0:
        return False
    else:
        for student in students_serializer.data:
            if student["in_range"] == False:
                return False
        return True


