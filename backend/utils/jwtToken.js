// utils/jwtToken.js
import jwt from "jsonwebtoken";

export const signLogin = (user, profileId = null) => {
  // user: mongoose doc (user._id), or plain object
  const payload = {
    id: user._id ? user._id.toString() : user.id,
    role: user.role?.name || user.role || "Patient",
    profileId: profileId ? profileId.toString() : null,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};

export const sendAuthCookie = (res, token, roleName, statusCode = 200, userData = {}) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  res.status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      role: roleName,
      data: userData,
    });
};
