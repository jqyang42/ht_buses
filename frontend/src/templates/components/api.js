import axios from "axios";

export default axios.create({
    baseURL: `http://localhost:8000/api/`,
    headers: {
        Authorization: sessionStorage.getItem('token') ? `Token ${sessionStorage.getItem('token')}` : ``
      }
  });
  