import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

// Puedes definir la URL externa solo en producción
const baseURL = isProd
  ? process.env.NEXT_PUBLIC_BACKEND_URL // producción
  : "http://localhost:1337/api"; // desarrollo

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
