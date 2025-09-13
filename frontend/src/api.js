// frontend/src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:7000/api/v1";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

// Gắn token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("u");
      const url = window.location.pathname + (window.location.search || "");
      window.location.href = `/login?redirect=${encodeURIComponent(url)}`;
    }
    return Promise.reject(err);
  }
);

export default api;
