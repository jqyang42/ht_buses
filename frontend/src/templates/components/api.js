import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:8000/api/`,
    headers: {
        Authorization: localStorage.getItem('token') ? `Token ${localStorage.getItem('token')}` : ``
      }
});

const interceptor_api = axios.create({
    baseURL: `http://localhost:8000/api/`,
    headers: {
        Authorization: localStorage.getItem('token') ? `Token ${localStorage.getItem('token')}` : ``
      }
});

api.interceptors.request.use( config => {
    interceptor_api.get(`users/update-stored-info`)
    .then(res => {
        const data = res.data.data
        if(data.success) {
            localStorage.setItem('user_id', data.user_id)
            localStorage.setItem('role',  data.role_value)
            localStorage.setItem('is_parent', data.is_parent)
            localStorage.setItem('first_name', data.first_name)
            localStorage.setItem('last_name', data.last_name)
            localStorage.setItem('is_staff', data.role_id !== 4 && data.role_id !== 5)
            localStorage.setItem('logged_in', data.logged_in)
            localStorage.setItem('token', res.data.token)
        }
        else {
            localStorage.clear()
        }
    }).catch (error => {
        if (error.response.status !== 200) {
            localStorage.clear()
        }
    })
    return config
})

export default api