// backend/middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/** Kiểm tra đã đăng nhập */
export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role, profileId }
    next();
  } catch (err) {
    console.error("isAuthenticatedUser error:", err);
    return res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};

/** Kiểm tra role có thuộc danh sách cho phép */
export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: `Yêu cầu quyền: ${roles.join(", ")}` });
      }
      next();
    } catch (err) {
      console.error("authorizeRoles error:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  };
};

/** Chỉ dành cho Admin */
export const isAdmin = authorizeRoles("Admin");

/** Alias để hệ thống mới/cũ vẫn chạy */
export const isAuth = isAuthenticatedUser;
