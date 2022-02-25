import json
from rest_framework.test import APIClient, APITestCase
from django.core.exceptions import ValidationError
from ..models import UserManager, School, Route, User, Student



class Test_user_create(APITestCase):
    endpoint = '/users/create'
    endpoint2 = '/users/edit'
    # Load login json
    def signup_info(path):
        with open(path) as f:
            return json.load(f)
    def create_school_route():
        school = School.objects.create(name = "East Middle School", address = "90 East Ave")
        route = Route.routeTables.create(name="Hilly Route", school_id = school,description="This is route 2" )
        route = Route.routeTables.create(name="Route 2", school_id = school,description="This is route 2" )
        school = School.objects.create(name = "West High School", address = "82 West Ave")
        route = Route.routeTables.create(name="Route 1", school_id = school,description="This is route 1" )

    # Tests
    def test_create_user_parent(self):
        Test_user_create.create_school_route()
        response = APIClient().post(self.endpoint, data = Test_user_create.signup_info("ht_buses_app/tests/resources/create_user/create_user_parent.json"), format='json')
        assert response.status_code == 200 # Checks that the response code is successful

    def test_create_user_admin(self):
        response = APIClient().post(self.endpoint, data = Test_user_create.signup_info("ht_buses_app/tests/resources/create_user/create_admin_user.json"), format='json')
        assert response.status_code == 200 # Checks that the response code is successful
        
    def test_create_user_admin_parent(self):
        Test_user_create.create_school_route()
        response = APIClient().post(self.endpoint, data = Test_user_create.signup_info("ht_buses_app/tests/resources/create_user/create_user_admin_parent.json"), format='json')
        #assert User.objects.get(email = email)
        assert response.status_code == 200 # Checks that the response code is successful

    def test_edit_user(self):
        Test_user_create.create_school_route()
        User.objects.create(first_name= "Mary", last_name ="Poppins",email = "fun@gmail.com",password = "yellow",address ="Hilly Ave",is_staff = True,is_parent = True)
        response = APIClient().post(self.endpoint2, data = Test_user_create.signup_info("ht_buses_app/tests/resources/create_user/user_edit.json"), format='json')
        assert User.objects.filter(email = "funny@gmail.com",  first_name = "Marre", last_name = "Poppy").count() > 0
        assert Student.studentsTable.filter(first_name = "Not Henry", route_id = Route.routeTables.get(name ="Hilly Route")).count() > 0
        assert response.status_code == 200 # Checks that the response code is successful



      