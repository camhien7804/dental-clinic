// src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:7000/api/v1";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

// Gắn token cho mọi request (kể cả F5 lại trang)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Nếu 401 -> xóa token + chuyển về /login?redirect=…
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("u");
      } catch (_) {}
      const url = window.location.pathname + (window.location.search || "");
      window.location.href = `/login?redirect=${encodeURIComponent(url)}`;
    }
    return Promise.reject(err);
  }
);

export default api;