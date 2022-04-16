from ....models import Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ....serializers import StudentSerializer
from ...stops import check_in_range

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def parent_student_stops(request):
    data = {}
    id = request.query_params["id"]
    page_number = request.query_params["page"]
    try:
        student = Student.objects.get(pk=id)
        student_serializer = StudentSerializer(student, many=False)
        student_stops_all = check_in_range.check_student_in_range(student_serializer.data["user_id"], student_serializer.data["route_id"])
        if int(page_number) == 0:
            student_stops = student_stops_all
        elif int(page_number) == 1:
            student_stops = student_stops_all[:10*int(page_number)]
        else:
            student_stops = student_stops_all[(1+10*(int(page_number)-1)):(10*int(page_number))]
        total_page_num = len(student_stops_all) // 10 + (len(student_stops_all) % 10 > 0)
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
        data["stops"] = student_stops
        data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
        data["success"] = True
        return Response(data)
    except:
        data["success"] = False
        return Response(data, status = 404)