import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:8000/api/`,
    headers: {
        Authorization: localStorage.getItem('token') ? `Token ${localStorage.getItem('token')}` : ``
      }
});

api.interceptors.request.use(() => {
    api.get(`users/update-stored-info`)
    .then(res => {
        const data = res.data
        localStorage.setItem('user_id', data.user_id)
        localStorage.setItem('role',  data.role_value)
        localStorage.setItem('is_parent', data.is_parent)
        localStorage.setItem('first_name', data.first_name)
        localStorage.setItem('last_name', data.last_name)
        localStorage.setItem('is_staff', data.role_id !== 4)
        localStorage.setItem('logged_in', data.logged_in)
    })
})

export default api