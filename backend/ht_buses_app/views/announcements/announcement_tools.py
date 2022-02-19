from ...models import User, Student, Route, School, Stop, Location
from ...constants import constants
from rest_framework.parsers import json
from django.core.mail import *
from django.template.loader import render_to_string
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import get_connection, EmailMultiAlternatives
from django.conf import settings
from ..parents import parent_student_detail
import datetime
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer, StopSerializer

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

def announcement_substitutions(user, subject, body, include_route_info):
    from_email = 'Hypothetical Transportation'
    text_content = """
    {}
    """.format(body)
    if include_route_info and user.is_parent:
        text_content= """
        {}
        
        {}
        """.format(text_content, tailored_parent_email(user))
    msg = EmailMultiAlternatives(subject, text_content, from_email, [user.email], reply_to=[constants.DEFAULT_NO_REPLY_EMAIL])
    #template = get_template('basic-email.html')
    #dynamic_data = { 'user_first': user.first_name, 'user_last': user.last_name } #TODO try using html
    #html_content = html_c.render(dynamic_data)
    #msg.attach_alternative(html_content)
    return msg

def tailored_parent_email(user):
    parent_body = ""
    if user.is_parent:
        students = Student.studentsTable.filter(user_id = user)
        student_body = ""
        for student in students:
            student_arr = parent_student_detail.student_arr_data(student)
            try:
                route_data = student_arr["route"]
                route_name = route_data["name"]
                stop_string = make_stop_body(route_data["id"])
            except:
                route_name = "Unassigned"
                stop_string = "N/A"
            student_body = """{}
            Name: {} {}\tSchool ID: {}\tSchool Name: {}\tRoute Name: {}\n
            Route Stop Options: {}\n
            """.format(student_body,student_arr["first_name"], student_arr["last_name"],student_arr["school_student_id"], student_arr["school_name"], route_name, stop_string)
        parent_body = """
        Here is your students' information:\n
        {}\n
        """.format(student_body) 
        return parent_body

def make_stop_body(route):
    try:
        stops = Stop.stopTables.filter(route_id = route)
        stop_string = ""
        for stop in stops:
            stop_serializer = StopSerializer(stop, many=False)
            stop_data = stop_serializer.data
            location = Location.locationTables.get(pk = stop_data["location_id"])
            address = location.address
            new_stop = """{}
            Stop Name: {}   Location: {}    Arrival: {}    Departure: {}\t\n
            """.format(stop_string, stop_data["name"], address, stop_data["arrival"], stop_data["departure"])
            stop_string = new_stop
    except:
        stop_string = "N/A"
    return stop_string

def send_mass_announcement(subject, body, recipients, include_route_info=False):
    data = {}
    to_emails = []
    messages = []
    for user in recipients:
        if "@example.com" not in user.email: 
            messages.append(announcement_substitutions(user, subject, body, include_route_info))     
    try:
        connection = get_connection(
            username=settings.EMAIL_HOST_USER, password=settings.EMAIL_HOST_PASSWORD, fail_silently=False)
        connection.send_messages(messages)
        data["message"] = "messages successfully sent"
        data["success"] = True
        return data
    except:
        data["message"] = "messages not successfully sent"
        data["success"] = False
        return data