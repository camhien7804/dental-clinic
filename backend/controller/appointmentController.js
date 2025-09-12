import fs from "fs";
import path from "path";
import Appointment from "../models/appointment.js";
import PatientProfile from "../models/PatientProfile.js";
import DentistProfile from "../models/DentistProfile.js";
import Service from "../models/Service.js";
import { sendMail } from "../utils/mailer.js";
import { generateInvoice } from "../utils/invoice.js";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helpers
const pad = (n) => String(n).padStart(2, "0");
const toTimeSlot = (s, e) =>
  `${pad(s.getHours())}:${pad(s.getMinutes())} - ${pad(e.getHours())}:${pad(
    e.getMinutes()
  )}`;
const getServicePrice = (svc) => {
  if (Number.isFinite(svc?.minPrice)) return Number(svc.minPrice);
  if (Number.isFinite(svc?.maxPrice)) return Number(svc.maxPrice);
  return 0;
};

// Populate configs
const POPULATE_PATIENT = {
  path: "patient",
  select: "phone user",
  populate: { path: "user", select: "name email" },
};
const POPULATE_DENTIST = {
  path: "dentist",
  select: "specialization user",
  populate: { path: "user", select: "name email" },
};
const POPULATE_SERVICE = {
  path: "serviceId",
  select: "name minPrice maxPrice durationMins",
};

/** 📅 Patient/Admin tạo lịch hẹn */
export const createAppointment = async (req, res) => {
  try {
    const {
      dentist,
      serviceId,
      service,
      startAt,
      endAt,
      notes,
      name: formName,
      phone: formPhone,
      email: formEmail,
    } = req.body;

    if (!serviceId && !service) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin dịch vụ" });
    }
    if (!startAt || !endAt) {
      return res.status(400).json({ success: false, message: "Thiếu thời gian bắt đầu/kết thúc" });
    }

    const s = new Date(startAt);
    const e = new Date(endAt);
    if (isNaN(s) || isNaN(e)) {
      return res.status(400).json({ success: false, message: "Định dạng thời gian không hợp lệ" });
    }

    // lấy dịch vụ
    let svc = null;
    if (serviceId) svc = await Service.findById(serviceId).lean();
    if (!svc && service) svc = await Service.findOne({ name: service }).lean();
    if (!svc) return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ" });

    // lấy thông tin bệnh nhân
    let patientProfile = null;
    let patientId = null;
    if (req.user.role === "Patient") {
      patientProfile = await PatientProfile.findOne({ user: req.user.id }).populate("user");
      if (!patientProfile) {
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh nhân" });
      }
      patientId = patientProfile._id;
    } else {
      if (!formName || !formPhone) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin bệnh nhân (tên, SĐT)" });
      }
    }

    // xử lý bác sĩ
    let assignedDentistId = dentist || null;
    const weekday = DAYS[s.getDay()];
    const timeStr = `${pad(s.getHours())}:${pad(s.getMinutes())}`;

    if (!assignedDentistId) {
      const candidates = await DentistProfile.find({
        workDays: weekday,
        workStart: { $lte: timeStr },
        workEnd: { $gte: timeStr },
      }).populate("user", "name");

      if (!candidates.length) {
        return res.status(400).json({ success: false, message: "Không có bác sĩ nào làm việc trong khung giờ này" });
      }

      const freeDentists = [];
      for (const d of candidates) {
        const conflict = await Appointment.findOne({
          dentist: d._id,
          startAt: { $lt: e },
          endAt: { $gt: s },
          status: { $in: ["pending", "confirmed"] },
        });
        if (!conflict) freeDentists.push(d);
      }
      if (!freeDentists.length) {
        return res.status(400).json({ success: false, message: "Tất cả bác sĩ đã có lịch trong khung giờ này" });
      }
      const randomDentist = freeDentists[Math.floor(Math.random() * freeDentists.length)];
      assignedDentistId = randomDentist._id;
      console.log("🎯 Auto assign dentist:", randomDentist.user?.name);
    } else {
      const d = await DentistProfile.findById(assignedDentistId).lean();
      if (!d) return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ" });
      if (!d.workDays.includes(weekday)) {
        return res.status(400).json({ success: false, message: "Bác sĩ không làm việc ngày này" });
      }
      if (timeStr < d.workStart || timeStr >= d.workEnd) {
        return res.status(400).json({ success: false, message: "Giờ hẹn nằm ngoài giờ làm việc của bác sĩ" });
      }
      const conflict = await Appointment.findOne({
        dentist: assignedDentistId,
        startAt: { $lt: e },
        endAt: { $gt: s },
        status: { $in: ["pending", "confirmed"] },
      });
      if (conflict) {
        return res.status(400).json({ success: false, message: "Bác sĩ đã có lịch hẹn, vui lòng chọn khung giờ khác" });
      }
    }

    // chuẩn hóa ngày
    const appointmentDate = new Date(s);
    appointmentDate.setHours(0, 0, 0, 0);

    // xác định nguồn tạo
    let createdSource = "web";
    if (req.user.role === "Admin") createdSource = "admin";
    if (req.user.role === "Dentist") createdSource = "dentist";

    // tạo lịch hẹn
    let appt = await Appointment.create({
      patient: patientId,
      patientName: formName?.trim() || patientProfile?.user?.name || "",
      patientPhone: formPhone?.trim() || patientProfile?.phone || "",
      patientEmail: formEmail?.trim() || patientProfile?.user?.email || "",
      dentist: assignedDentistId,
      serviceId: svc._id,
      service: svc.name || service || "",
      servicePrice: getServicePrice(svc),
      startAt: s,
      endAt: e,
      appointmentDate,
      timeSlot: toTimeSlot(s, e),
      status: "pending",
      notes: notes || "",
      createdBy: req.user.id,
      createdSource,
    });

    appt = await Appointment.findById(appt._id).populate(POPULATE_DENTIST).lean();

    // tạo PDF & gửi mail
    try {
      const invoicePath = await generateInvoice(appt); // ✅ await
      if (appt.patientEmail) {
        await sendMail({
          to: appt.patientEmail,
          subject: "Xác nhận đặt lịch khám nha khoa",
          html: `
            <h2>Xin chào ${appt.patientName},</h2>
            <p>Bạn đã đặt lịch khám thành công tại <b>Phòng khám Nha khoa</b>.</p>
            <p><b>Dịch vụ:</b> ${appt.service}</p>
            <p><b>Thời gian:</b> ${appt.timeSlot}</p>
            <p>Vui lòng đến đúng giờ hẹn để được phục vụ tốt nhất.</p>
            <p>Chúc quý khách luôn có nụ cười tỏa sáng ✨</p>
          `,
          attachments: [{ filename: `invoice_${appt._id}.pdf`, path: invoicePath }],
        });
      }
    } catch (mailErr) {
      console.error("⚠️ Lỗi gửi email/PDF:", mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Đặt lịch thành công",
      data: appt,
      downloadUrl: `/api/v1/appointments/${appt._id}/invoice`,
    });
  } catch (err) {
    console.error("❌ createAppointment error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 📄 Tải file PDF */
export const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate(POPULATE_DENTIST)
      .lean();
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch hẹn" });
    }

    const filePath = await generateInvoice(appointment); // ✅ await
    res.download(filePath, `invoice_${appointment._id}.pdf`);
  } catch (err) {
    console.error("Download invoice error:", err);
    res.status(500).json({ success: false, message: "Không thể tải PDF", error: err.message });
  }
};

/** ❌ Hủy lịch (Admin/Dentist) */
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const cancelled = await Appointment.findByIdAndUpdate(
      id,
      { status: "cancelled", cancelReason: reason || "Không rõ" },
      { new: true }
    )
      .populate(POPULATE_PATIENT)
      .populate(POPULATE_DENTIST)
      .populate(POPULATE_SERVICE);

    if (!cancelled) return res.status(404).json({ success: false, message: "Không tìm thấy lịch hẹn" });
    res.json({ success: true, message: "Đã hủy lịch", data: cancelled });
  } catch (err) {
    console.error("cancelAppointment error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 🧭 Admin: xem tất cả lịch hẹn */
export const getAllAppointments = async (_req, res) => {
  try {
    const items = await Appointment.find()
      .populate(POPULATE_PATIENT)
      .populate(POPULATE_DENTIST)
      .populate(POPULATE_SERVICE)
      .sort({ startAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("getAllAppointments error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 👤 Patient: xem lịch của mình */
export const getMyAppointmentsForPatient = async (req, res) => {
  try {
    const patient = await PatientProfile.findOne({ user: req.user.id }).select("_id");
    if (!patient) return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân" });

    const items = await Appointment.find({ patient: patient._id })
      .populate(POPULATE_DENTIST)
      .populate(POPULATE_SERVICE)
      .sort({ startAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("getMyAppointmentsForPatient error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 🦷 Dentist: xem lịch của mình */
export const getMyAppointmentsForDentist = async (req, res) => {
  try {
    const dentist = await DentistProfile.findOne({ user: req.user.id }).select("_id workDays workStart workEnd");
    if (!dentist) return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ" });

    const items = await Appointment.find({ dentist: dentist._id })
      .populate(POPULATE_PATIENT)
      .populate(POPULATE_DENTIST)
      .populate(POPULATE_SERVICE)
      .sort({ startAt: -1 });

    res.json({
      success: true,
      data: items,
      workDays: dentist.workDays,
      workStart: dentist.workStart,
      workEnd: dentist.workEnd,
    });
  } catch (err) {
    console.error("getMyAppointmentsForDentist error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 📚 Patient: xem lịch sử điều trị (completed) */
export const getTreatmentHistoryForPatient = async (req, res) => {
  try {
    const profileId = req.user?.profileId;
    if (!profileId) return res.status(400).json({ success: false, message: "Không xác định bệnh nhân" });

    const history = await Appointment.find({ patient: profileId, status: "completed" })
      .populate(POPULATE_DENTIST)
      .populate(POPULATE_SERVICE)
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: history });
  } catch (err) {
    console.error("getTreatmentHistoryForPatient error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 🔎 Admin/Dentist: xem lịch sử điều trị theo patientId */
export const getPatientHistoryById = async (req, res) => {
  try {
    const { id: patientProfileId } = req.params;
    if (!patientProfileId) return res.status(400).json({ success: false, message: "Thiếu patient id" });

    const history = await Appointment.find({ patient: patientProfileId, status: "completed" })
      .populate(POPULATE_PATIENT)
      .populate(POPULATE_DENTIST)
      .populate(POPULATE_SERVICE)
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: history });
  } catch (err) {
    console.error("getPatientHistoryById error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 🔁 Cập nhật trạng thái (Admin/Dentist) */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ALLOWED = ["pending", "confirmed", "completed", "cancelled", "no_show"];

    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true })
      .populate(POPULATE_PATIENT)
      .populate(POPULATE_DENTIST)
      .populate(POPULATE_SERVICE);

    if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy lịch hẹn" });
    res.json({ success: true, message: "Cập nhật thành công", data: updated });
  } catch (err) {
    console.error("updateAppointmentStatus error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** ✏️ Cập nhật lịch sử điều trị (Admin/Dentist) */
export const updateAppointmentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { treatmentNotes, prescriptions } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch hẹn" });
    }

    appointment.treatmentNotes = treatmentNotes || appointment.treatmentNotes;
    appointment.prescriptions = prescriptions || appointment.prescriptions;
    await appointment.save();

    res.json({ success: true, message: "Cập nhật thành công", data: appointment });
  } catch (err) {
    console.error("updateAppointmentHistory error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};
