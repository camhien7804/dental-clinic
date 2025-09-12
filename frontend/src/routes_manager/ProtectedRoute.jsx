// src/routes_manager/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, requireRole = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Nếu auth đang loading (chưa xác định user) => hiển thị loading
  if (loading) {
    return <div className="text-center p-6">Đang xác thực...</div>;
  }

  // Nếu chưa đăng nhập
  if (!user) {
    const redirectTo = `${location.pathname}${location.search || ""}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  // Nếu có yêu cầu role
  if (requireRole) {
    const allowed = Array.isArray(requireRole)
      ? requireRole
      : String(requireRole)
          .split("|")
          .map((s) => s.trim());

    if (!allowed.includes(user.role)) {
      // Sai quyền => đưa về trang home theo role
      const roleHome = getRoleHome(user.role);
      return <Navigate to={roleHome} replace />;
    }
  }

  return children;
}

function getRoleHome(role) {
  if (!role) return "/dashboard";
  if (role === "Admin") return "/admin";
  if (role === "Dentist") return "/dentist";
  return "/dashboard";
}
