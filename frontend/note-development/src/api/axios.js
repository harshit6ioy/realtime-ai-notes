import axios from "axios";

let apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl && apiUrl.includes("localhost")) {
  apiUrl = apiUrl.replace("localhost", window.location.hostname);
}

const API = axios.create({
  baseURL: apiUrl,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;