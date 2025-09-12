// backend/router/dentistRoutes.js
// backend/router/dentistRoutes.js
import express from "express";
import {
  createDentist,
  updateDentist,
  getAllDentists,
  deleteDentist,
  updateWorkSchedule,
} from "../controller/dentistController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

/**
 * 📌 Routes Dentist
 */

// 🔓 Public: lấy danh sách bác sĩ (dùng cho FE Booking để chọn bác sĩ)
router.get("/", getAllDentists);

// 🛡️ Admin: tạo bác sĩ mới
router.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  createDentist
);

// 🛡️ Admin: cập nhật thông tin bác sĩ
router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  updateDentist
);

// 🛡️ Admin: cập nhật lịch làm việc của bác sĩ
router.put(
  "/:id/schedule",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  updateWorkSchedule
);

// 🛡️ Admin: xóa bác sĩ
router.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("Admin"),
  deleteDentist
);

export default router;
