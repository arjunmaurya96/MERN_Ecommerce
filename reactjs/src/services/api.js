import axios from "axios";

const api = axios.create({
  // baseURL: "https://mern-ecommerce-zt4z.onrender.com/api",
   baseURL: "https://mern-ecommerce-zt4z.onrender.com/api",
});

// 🔐 Token auto attach
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
