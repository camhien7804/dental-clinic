// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("u");
    const token = localStorage.getItem("token");
    if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
    if (u) setUser(JSON.parse(u));
  }, []);

  const login = async ({ username, password }) => {
    const res = await api.post("/auth/login", { email: username, password });
    const body = res.data;

    const token = body.token;
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }

    const dataUser = body.data || body.user;
    localStorage.setItem("u", JSON.stringify(dataUser));
    setUser(dataUser);
    return dataUser;
  };

  const register = async (payload) => {
    await api.post("/auth/register", payload);
    return true;
  };

  const forgotPassword = async (email) => {
    await api.post("/auth/forgot-password", { email });
  };

  const resetPassword = async (token, password) => {
    await api.post(`/auth/reset-password/${token}`, { password });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, register, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
