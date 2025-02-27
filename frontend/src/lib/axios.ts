import axios from "axios";

const APP_ENV = import.meta.env.VITE_APP_ENV;

const api = axios.create({
  baseURL: APP_ENV === "PROD" ? import.meta.env.VITE_API : import.meta.env.VITE_DEV_API,
  withCredentials: true,
});

export default api;
