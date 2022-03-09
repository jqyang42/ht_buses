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
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer, StopSerializer, LocationSerializer
from ..stops import check_in_range 
from datetime import datetime
from ..general.general_tools import filtered_users_helper


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
    #Add text content later
    text_content = """ 
    {}
    """.format(body)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [user.email], reply_to=[constants.DEFAULT_NO_REPLY_EMAIL])
    students_arr = []
    include_parent_info = False
    if include_route_info and user.is_parent:
        students_arr = get_students_info(user)
        include_parent_info = True
    msg_html = render_to_string('basic-email.html', ({'include_parent_info': include_parent_info,'first_name': user.first_name, 'last_name': user.last_name, 'body': body, 'students': students_arr, 'home_url': constants.HOME_URL}))
    msg.attach_alternative(msg_html, "text/html")
    return msg

def get_students_info(user):
    students_array = []
    if user.is_parent:
        students = Student.objects.filter(user_id = user)
        for student in students:
            student_array = parent_student_detail.student_arr_data(student)
            route_data = student_array["route"]
            student_array["route_name"] = route_data["name"]
            try:
                student_array["route_description"] = route_data["description"]
            except:
                student_array["route_description"] = "None"
            if student_array["route_description"] == "":
                student_array["route_description"] = "None"
            student_array["stops"] = get_stop_array(user,route_data["id"])
            students_array.append(student_array)
    return students_array

def get_stop_array(user, route_id):
    stops_array = []
    try: 
        stops = check_in_range.check_student_in_range(user.id, route_id)
        for stop in stops:
            stop_array = {}
            stop_data = stop
            location = Location.objects.get(pk = stop_data["location"]["id"])
            stop_array["address"] = location.address
            stop_array["name"] = stop_data["name"]
            d = datetime.strptime(stop_data["arrival"], "%H:%M")
            arrival_converted = d.strftime("%I:%M %p")
            stop_array["arrival"] = arrival_converted
            d = datetime.strptime(stop_data["departure"], "%H:%M")
            departure_converted = d.strftime("%I:%M %p")
            stop_array["departure"] = departure_converted
            stops_array.append(stop_array)
    except:
        stops_array = []
    return stops_array

def send_mass_announcement(subject, body, recipients, include_route_info=False):
    data = {}
    to_emails = []
    messages = []
    for user in recipients:
        if "@example.com" not in user.email: 
            messages.append(announcement_substitutions(user, subject, body, include_route_info))     
    try:
        connection = get_connection(
            username=settings.EMAIL_HOST_USER, password=settings.EMAIL_HOST_PASSWORD, fail_silently=True)
        connection.send_messages(messages)
        data["message"] = "messages successfully sent"
        data["success"] = True
        return data
    except:
        data["message"] = "messages not successfully sent"
        data["success"] = False
        return data