import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://fitnesstracker-backend-m43k.onrender.com/api" 
    : "http://localhost:5000/api",
});

export default api;
