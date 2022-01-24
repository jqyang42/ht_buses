import json
from rest_framework.test import APIClient, APITestCase
from django.core.exceptions import ValidationError

class Test_user_login(APITestCase):
    endpoint = '/login'
    create_endpoint = '/users/create'
    # Load login json
    def login_info(path):
        with open(path) as f:
            return json.load(f)
    def create_admin():
        APIClient().post(self.create_endpoint, data = Test_user_create.signup_info("ht_buses_app/tests/resources/create_user/create_admin_user.json"), format='json')
    # Tests
    def test_user_login_success(self):
        Test_user_login.create_admin()
        response = APIClient().post(self.endpoint, data = Test_user_login.login_info("ht_buses_app/tests/resources/login/login_req.json"), format='json')
        assert response.status_code == 200 # Checks that the response code is successful
    
    def test_user_login_failed_user_does_not_exist(self):
        try:
            response = APIClient().post(self.endpoint, data = Test_user_login.login_info("ht_buses_app/tests/resources/login/login_req_not_exist.json"), format = 'json')
            if response.status_code == 200:
                return False
        except ValidationError as e:
            if str(e) == "Account does not exist":
                return True # If we get validation error, then it's true
            else:
                return False
        
    def test_user_login_failed_wrong_password(self):
        Test_user_login.create_admin()
        try:
            response = APIClient().post(self.endpoint, data = Test_user_login.login_info("ht_buses_app/tests/resources/login/login_req_wrong_password.json"), format = 'json')
            if response.status_code == 200:
                return False
        except ValidationError as e:
            if str(e) == "Incorrect password":
                return True # If we get validation error, then it's true
            else:
                return False

        
