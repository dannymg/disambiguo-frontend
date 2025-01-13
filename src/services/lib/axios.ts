import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `${process.env.API_TOKEN}`,
  },
});

export default axiosInstance;


