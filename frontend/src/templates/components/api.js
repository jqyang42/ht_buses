import axios from "axios";

export default axios.create({
    baseURL: "https://vcm-25151.vm.duke.edu/api/",
    headers: {
        Authorization: sessionStorage.getItem('token') ? `Token ${sessionStorage.getItem('token')}` : ``
      }
  });
  