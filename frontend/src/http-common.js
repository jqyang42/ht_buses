import axios from "axios";
import { API_DOMAIN } from "./constants";

export default axios.create({
  baseURL: API_DOMAIN,
  headers: {
    "Content-type": "application/json"
  }
});