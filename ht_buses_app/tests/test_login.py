import json
from rest_framework.test import APIClient, APIRequestFactory, APITestCase

class Test_user_login(APITestCase):
    endpoint = '/login'
    # Load login json
    def login_info():
        with open("ht_buses_app/tests/resources/login_req.json") as f:
            return json.load(f)
    # Tests
    def test_user_login_success(self, api_client):
        response = api_client().post(self.endpoint, data = User_login_test.login_info(), format='json')
        assert response.status_code == 200 # Checks that the response code is successful
    
    # def test_user_login_failed_user_does_not_exist(self, api_client):
        
    
    # def test_user_login_failed_wrong_credentials(self, api_client):
        
