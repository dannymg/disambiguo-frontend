import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
