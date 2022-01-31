from ...models import School
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ...serializers import SchoolSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def schools(request):
    data = {}
    schools = School.schoolsTable.all()
    # COMMENTED OUT CODE FOR PAGINATION
    # page_number = request.query_params["page"]
    # if int(page_number) == 1:
    #     schools = School.schoolsTable.all()[:10*int(page_number)]
    # else:
    #     schools = School.schoolsTable.all()[(1+10*(int(page_number)-1)):(10*int(page_number))]
    school_serializer = SchoolSerializer(schools, many=True)
    data["schools"] = school_serializer.data
    return Response(data)