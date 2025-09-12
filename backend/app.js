// backend/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";

import { errorMiddleware } from "./middlewares/error.js";

// routers
import serviceRoutes from "./router/serviceRoutes.js";
import dentistRoutes from "./router/dentistRoutes.js";
import appointmentRoutes from "./router/appointmentRoutes.js";
import patientRoutes from "./router/patientRoutes.js";
import adminRoutes from "./router/adminRoutes.js";
import authRoutes from "./router/authRoutes.js";
import inventoryRoutes from "./router/inventoryRoutes.js";
import postRoutes from "./router/postRoutes.js";
import chatbotRoutes from "./router/chatbotRoutes.js";
import adminUserRoutes from "./router/adminUserRoutes.js";

const app = express();

// CORS config
const allowedOrigins = [
  process.env.FRONTEND_URL_ONE || "http://localhost:5173",
  process.env.FRONTEND_URL_TWO || "http://localhost:3000",
  "https://dental-clinic-5gnk.onrender.com"  
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser requests (postman, mobile) without origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    console.warn(`Blocked CORS request from: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
/* preflight handler: return 204 for OPTIONS */
app.options("*", (req, res) => res.sendStatus(204));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for safety
  })
);

// serve backend public files (images saved locally)
app.use("/public", express.static(path.join(process.cwd(), "backend/public")));
app.use("/images", express.static(path.join(process.cwd(), "backend/public/images")));

// mount routers
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/dentists", dentistRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1", chatbotRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);


// error handler (must be last)
app.use(errorMiddleware);

export default app;
