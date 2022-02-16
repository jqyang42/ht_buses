from ...models import User, Student, Route, School
from ...constants import constants
from rest_framework.parsers import json
from django.core.mail import *
from django.template.loader import render_to_string
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import get_connection, EmailMultiAlternatives
from django.conf import settings

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

def announcement_substitutions(user, subject, body, include_route_info = False):
    from_email = 'Hypothetical Transportation'
    text_content = """
    {}
    """.format(body)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [user.email], reply_to=['no-reply@beesquared.com'])
    #template = get_template('basic-email.html')
    #dynamic_data = { 'user_first': user.first_name, 'user_last': user.last_name } #TODO add route customization
    #html_content = html_c.render(dynamic_data)
    #msg.attach_alternative(html_content)
    return msg


def send_mass_announcement(subject, body, recipients, include_route_info):
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