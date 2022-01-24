import json
from rest_framework.test import APIClient, APITestCase
from django.core.exceptions import ValidationError
from ..models import UserManager, School, Route


class Test_user_create(APITestCase):
    endpoint = '/users/create'
    # Load login json
    def signup_info(path):
        with open(path) as f:
            return json.load(f)
    def create_school_route():
        school = School.schoolsTable.create(name = "East Middle School", address = "90 East Ave")
        route = Route.routeTables.create(name="Route 2", school_id = school,description="This is route 2" )
        school = School.schoolsTable.create(name = "West High School", address = "82 West Ave")
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


      