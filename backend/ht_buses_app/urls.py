from django.urls import path
from . views.students import students_view, student_detail, student_route_edit, student_edit, student_delete, student_add
from . views.schools import school_create, school_delete, school_detail, school_edit, schools_view
from . views.routes import route_delete, route_edit, route_planner, routes_view, route_detail, route_create
from . views.users import user_create, user_delete, user_detail, user_edit, user_edit_password, users_view
from . views.auth import auth_valid, login, logout
from . views.parents import parent_dashboard, parent_student_detail

urlpatterns = [
    path('students', students_view.students, name='students'),
    path('students/detail', student_detail.students_detail, name="students_detail"),
    path('schools', schools_view.schools, name="schools"),
    path('schools/detail', school_detail.schools_detail, name="schools_detail"),
    path('schools/create', school_create.school_create, name="school_create"),
    path('schools/edit', school_edit.school_edit, name="school_edit"),
    path('schools/delete', school_delete.school_delete, name="school_delete"),
    path('routes', routes_view.routes, name="routes"),
    path('routes/detail', route_detail.routes_detail, name="routes_detail"),
    path('routes/create', route_create.route_create, name="route_create"),
    path('routes/edit', route_edit.route_edit, name="route_edit"),
    path('routes/delete', route_delete.route_delete, name="route_delete"),
    path('users', users_view.users, name="users"),
    path('users/detail', user_detail.users_detail, name="users_detail"),
    path('users/create', user_create.user_create, name="users_create"),
    path('users/edit', user_edit.user_edit, name="users_edit"),
    path('users/password-edit', user_edit_password.user_password_edit, name="user_password_edit"),
    path('users/delete', user_delete.user_delete, name = "delete_user"),
    path('validAccess', auth_valid.validAccess, name = "validAccess"),
    path('routeplanner', route_planner.routeplanner, name="routeplanner"),
    path('logout', logout.user_logout, name="logout"),
    path('login', login.user_login, name="login"),
    path('', login.user_login, name="index"),
    path('users/add-students', student_add.add_new_students, name="add_new_students"),
    path('students/delete', student_delete.student_delete, name = "delete_student"),
    path('students/edit', student_edit.student_edit, name = "edit_student"),
    path('dashboard', parent_dashboard.parent_dashboard, name= "parent_dashboard"),
    path('dashboard/students/detail', parent_student_detail.parent_student_detail, name = "parent_student_detail"),
    path('routeplanner/edit', student_route_edit.student_route_edit, name='studnet_route_edit')
]