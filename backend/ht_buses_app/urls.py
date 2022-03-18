from django.urls import path
from django.db import models
from . import models 
from . views.students import students_view, student_detail, student_route_edit, student_edit, student_delete, student_add
from . views.schools import school_create, school_delete, school_detail, school_edit, schools_view, school_edit_time
from . views.routes import route_delete, route_edit, route_planner, routes_view, route_detail, route_create
from . views.users import user_create, user_delete, user_detail, user_edit, user_edit_password, users_view
from . views.auth import auth_valid, login, logout
from . views.parents import parent_dashboard, parent_student_detail
from . views.announcements import announcements
from . views.accounts import reset_password
from . views.general import general_apis
from . views.stops import stops_create, stops_view, stops_edit, stops_delete, stops_name_edit
from . views.students.detail import student_view_route, student_view_school
from . views.routes.detail import route_view_school
from . views.students.detail import student_view_user
from . views.users.detail import user_school
from . views.stops import stops_view_pag
from . views.general.general_tools import permission_setup
from . views.bulk_import import bulk_import_view_users, bulk_import_view_students, bulk_import_json_students,  bulk_import_json_users
from . views.bulk_import.validation import bulk_import_validate_students, bulk_import_validate_users
from . models import User

try:
    anon_user = User.objects.get(email = "AnonymousUser")
    anon_user.delete()
except:
    print("success")
#permission_setup() #TODO: figure out better place for this i.e after models, but only one time after runserver called
urlpatterns = [
    path('api/students', students_view.students, name='students'),
    path('api/students/detail', student_detail.students_detail, name="students_detail"),
    path('api/schools', schools_view.schools, name="schools"),
    path('api/schools/detail', school_detail.schools_detail, name="schools_detail"),
    path('api/schools/create', school_create.school_create, name="school_create"),
    path('api/schools/edit', school_edit.school_edit, name="school_edit"),
    path('api/schools/edit/time', school_edit_time.school_edit_time, name="school_edit_time"),
    path('api/schools/delete', school_delete.school_delete, name="school_delete"),
    path('api/routes', routes_view.routes, name="routes"),
    path('api/routes/detail', route_detail.routes_detail, name="routes_detail"),
    path('api/routes/create', route_create.route_create, name="route_create"),
    path('api/routes/edit', route_edit.route_edit, name="route_edit"),
    path('api/routes/delete', route_delete.route_delete, name="route_delete"),
    path('api/users', users_view.user_view, name="users"),
    path('api/users/detail', user_detail.users_detail, name="users_detail"),
    path('api/users/create', user_create.user_create, name="users_create"),
    path('api/users/edit', user_edit.user_edit, name="users_edit"),
    path('api/users/password-edit', user_edit_password.user_password_edit, name="user_password_edit"),
    path('api/users/edit/validate-email', user_edit.valid_email_edit, name="validate_email_edit"),
    path('api/users/school', user_school.user_school_view, name="user_school"),
    path('api/email_exists', general_apis.email_exists, name="email_exists"),
    path('api/users/delete', user_delete.user_delete, name = "delete_user"),
    path('api/routeplanner', route_planner.routeplanner, name="routeplanner"),
    path('api/logout', logout.user_logout, name="logout"),
    path('api/login', login.user_login, name="login"),
    path('api/', login.user_login, name="index"),
    path('api/users/add-students', student_add.add_new_students, name="add_new_students"),
    path('api/students/delete', student_delete.student_delete, name = "delete_student"),
    path('api/students/edit', student_edit.student_edit, name = "edit_student"),
    path('api/dashboard', parent_dashboard.parent_dashboard, name= "parent_dashboard"),
    path('api/dashboard/students/detail', parent_student_detail.parent_student_detail, name = "parent_student_detail"),
    path('api/routeplanner/edit', student_route_edit.student_route_edit, name='student_route_edit'),
    path('api/announcement/users', announcements.announcement_users, name='announcement_users'),
    path('api/announcement/schools', announcements.announcement_school, name='announcement_school'),
    path('api/announcement/routes', announcements.announcement_route, name='announcement_route'),
    path('api/account', user_detail.user_account, name='user_account'),
    path('api/send-reset-password-email', reset_password.send_reset_password_email, name='reset_password_email'),
    path('api/reset-password', reset_password.reset_password, name='reset_password'),
    path('api/reset-password-valid-url', reset_password.valid_password_reset_url, name='reset_password_valid_url'),
    path('api/stops/create', stops_create.stops_create, name='stops_create'),
    path('api/stops', stops_view_pag.stops_view, name='stops_view'),
    path('api/stops/edit', stops_edit.stops_edit, name='stops_edit'),
    path('api/stops/delete', stops_delete.stops_delete, name='stops_delete'),
    path('api/stops/edit-name', stops_name_edit.stops_name_edit, name='stops_name_edit'),
    path('api/students/route', student_view_route.students_route, name="student_view_route"),
    path('api/students/school', student_view_school.students_school, name="student_view_school"),
    path('api/students/user', student_view_user.students_user, name="student_view_user"),
    path('api/routes/school', route_view_school.routes_school, name='route_view_school'),
    path('api/bulk-import/users-upload', bulk_import_view_users.bulk_import, name='bulk-import-users-upload'),
    path('api/bulk-import/students-upload', bulk_import_view_students.bulk_import, name='bulk-import-students-upload'),
    path('api/bulk-import/users', bulk_import_json_users.bulk_import, name='bulk-import-users'),
    path('api/bulk-import/students', bulk_import_json_students.bulk_import, name='bulk-import-students'),
    path('api/bulk-import/users/validate', bulk_import_validate_users.bulk_import_validate, name='bulk-import-users-validate'),
    path('api/bulk-import/students/validate', bulk_import_validate_students.bulk_import_validate, name='bulk-import-students-validate'),

]

