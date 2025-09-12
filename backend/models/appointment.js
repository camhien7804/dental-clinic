import mongoose, { Schema, model } from "mongoose";

const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

const CREATED_SOURCES = ["web", "app", "admin", "dentist"];

const PAYMENT_METHODS = ["cash", "momo", "vnpay", "paypal", "zalopay"];

const PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded"];

const appointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "PatientProfile" },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientEmail: { type: String },

    dentist: {
      type: Schema.Types.ObjectId,
      ref: "DentistProfile",
      default: null,
    },
    clinic: { type: Schema.Types.ObjectId, ref: "Clinic" },
    room: { type: String },

    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    service: { type: String, required: true },
    servicePrice: { type: Number },

    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    startAt: { type: Date },
    endAt: { type: Date },

    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: "pending",
    },
    notes: { type: String },

    // 🔹 Payment
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "unpaid",
    },
    transactionId: { type: String },

    treatmentNotes: { type: String },
    prescriptions: { type: [String], default: [] },
    followUpDate: { type: Date },
    cancelReason: { type: String },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    createdSource: {
      type: String,
      enum: CREATED_SOURCES,
      default: "web",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  model("Appointment", appointmentSchema);
