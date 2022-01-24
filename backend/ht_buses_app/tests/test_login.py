import json
from rest_framework.test import APIClient, APITestCase
from django.core.exceptions import ValidationError

class Test_user_login(APITestCase):
    endpoint = '/login'
    # Load login json
    def login_info(path):
        with open(path) as f:
            return json.load(f)
    # Tests
    def test_user_login_success(self):
        # Need to somehow populate it with a user, currently fails because of empty database
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
        # Need to somehow populate it with a user, currently fails because of empty database
        try:
            response = APIClient().post(self.endpoint, data = Test_user_login.login_info("ht_buses_app/tests/resources/login/login_req_wrong_password.json"), format = 'json')
            if response.status_code == 200:
                return False
        except ValidationError as e:
            if str(e) == "Incorrect password":
                return True # If we get validation error, then it's true
            else:
                return False

        
