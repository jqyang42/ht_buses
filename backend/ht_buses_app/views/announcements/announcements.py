from ...models import User, Student, Route, School
from ...constants import constants
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import json
from django.core.mail import send_mail
from sendgrid.helpers.mail import *
from sendgrid import SendGridAPIClient
from django.conf import settings


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser])
def announcement_users(request):
    data={}
    subject, body, include_route_info = email_request_parser(request.data)
    try:
        recipients = User.objects.all()
        return send_mass_announcement(subject, body, recipients, include_route_info)
    except:
        data["message"] = "no users found"
        data["success"] = False
        return Response(data, status = 404) 


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def announcement_school(request):
    data = {}
    subject, body, include_route_info = email_request_parser(request.data)
    id = request.query_params["id"]
    try:
        school_id = School.schoolsTable.get(pk=id)
        students = Student.studentsTable.filter(school_id = school_id)
        recipients = filtered_users_helper(students)
        return send_mass_announcement(subject, body, recipients, include_route_info)
    except:
        data["message"] = "invalid school id"
        data["success"] = False
        return Response(data, status = 404) 

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def announcement_route(request):
    data = {}
    subject, body, include_route_info = email_request_parser(request.data)
    id = request.query_params["id"]
    try:
        route_id = Route.routeTables.get(pk=id)
        students = Student.studentsTable.filter(route_id = route_id)
        recipients = filtered_users_helper(students)
        return send_mass_announcement(subject, body, recipients, include_route_info)
    except:
        data["message"] = "invalid route id"
        data["success"] = False
        return Response(data, status = 404)

def filtered_users_helper(students):
    user_ids = students.values_list('user_id', flat=True)
    return User.objects.filter(pk__in=user_ids)

def email_request_parser(reqBody):
    subject= reqBody['email']['subject']
    body = reqBody['email']['body']
    try: 
        include_route_info = reqBody['include_route_info']
    except:
        include_route_info = False
    return subject, body, include_route_info

def announcement_substitutions(subject, body, user, include_route_info = False):
    if include_route_info:
        substitutions = {                   #TODO: add route tags to template and here
            'user_first': user.first_name,
            'user_last': user.last_name,
            'subject': subject,
            'body': body
        }
        return substitutions
    substitutions = {                   
            'subject': subject,
            'body': body
            }
    return substitutions

def send_mass_announcement(subject, body, recipients, include_route_info):
    data = {}
    to_emails = []
    
    if constants.TESTING:
        to_emails=[constants.DEFAULT_TO_EMAIL]
    
    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=to_emails, is_multiple=True)
    
    for user in recipients:
        personalization = Personalization()
        personalization.add_to(Email(user.email))
        personalization.dynamic_template_data = announcement_substitutions(subject, body, user, include_route_info)
        message.add_personalization(personalization)

    message.reply_to = ReplyTo(settings.DEFAULT_NO_REPLY_EMAIL)
    message.template_id = constants.ROUTE_ANNOUNCEMENT_TEMPLATE if include_route_info else constants.GENERAL_ANNOUNCEMENT_TEMPLATE
    try:
        sg = SendGridAPIClient(settings.EMAIL_HOST_PASSWORD)
        response = sg.send(message)
        code, body, headers = response.status_code, response.body, response.headers
        data["message"] = "messages successfully sent"
        data["success"] = True
        return Response(data) 
    except:
        data["message"] = "messages not successfully sent"
        data["success"] = False
        return Response(data) 
