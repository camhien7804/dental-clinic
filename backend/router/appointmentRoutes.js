import express from "express";
import {
  createAppointment,
  downloadInvoice,
  cancelAppointment,
  getAllAppointments,
  getMyAppointmentsForPatient,
  getMyAppointmentsForDentist,
  getTreatmentHistoryForPatient,
  getPatientHistoryById,
  updateAppointmentStatus,
   updateAppointmentHistory,
} from "../controller/appointmentController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// 📅 Tạo lịch hẹn
router.post("/", isAuthenticatedUser, createAppointment);

// 👤 Patient: xem lịch
router.get("/me", isAuthenticatedUser, getMyAppointmentsForPatient);

// 👤 Patient: lịch sử điều trị
router.get("/history/me", isAuthenticatedUser, getTreatmentHistoryForPatient);

// 🦷 Dentist: lịch của tôi
router.get("/dentist/me", isAuthenticatedUser, authorizeRoles("Dentist"), getMyAppointmentsForDentist);

// 🧭 Admin: tất cả lịch
router.get("/", isAuthenticatedUser, authorizeRoles("Admin"), getAllAppointments);

// 🔎 Admin/Dentist: lịch sử bệnh nhân
router.get("/patient/:id/history", isAuthenticatedUser, authorizeRoles("Admin", "Dentist"), getPatientHistoryById);

// 🔁 Cập nhật trạng thái
router.put("/:id/status", isAuthenticatedUser, authorizeRoles("Admin", "Dentist"), updateAppointmentStatus);

// ❌ Hủy
router.delete("/:id", isAuthenticatedUser, authorizeRoles("Admin", "Dentist"), cancelAppointment);

// 📄 PDF
router.get("/:id/invoice", isAuthenticatedUser, downloadInvoice);

router.put(
  "/:id/history",
  isAuthenticatedUser,
  authorizeRoles("Admin", "Dentist"),
  updateAppointmentHistory
);


export default router;
