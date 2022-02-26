import axios from "axios";

export default axios.create({
    baseURL: `http://localhost:8000/api/`,
    headers: {
        Authorization: localStorage.getItem('token') ? `Token ${localStorage.getItem('token')}` : ``
      }
  });
  