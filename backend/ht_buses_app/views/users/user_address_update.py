from ...serializers import StudentSerializer
from ...models import Student, Route
from ..stops import check_in_range
from ..routes import route_check_is_complete

def update_student_stop(user_id):
    students = Student.studentsTable.filter(user_id=user_id)
    students_serializer = StudentSerializer(students, many=True)
    for student in students_serializer.data:
        if student["route_id"] != None and student["route_id"] != 0:
            in_range_arr = check_in_range.check_student_in_range(user_id, student["route_id"])
            if len(in_range_arr) != 0:
                in_range = True
            else:
                in_range = False
            student_obj = Student.studentsTable.get(pk=student["id"])
            student_obj.in_range = in_range
            student_obj.save()
            is_complete = route_check_is_complete.route_is_complete(student["route_id"])
            route = Route.objects.get(pk=student["route_id"])
            route.is_complete = is_complete
            route.save()
