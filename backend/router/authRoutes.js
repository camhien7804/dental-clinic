import express from "express";
import * as ctrl from "../controller/authController.js";

const router = express.Router();

router.post("/login", ctrl.login);
router.post("/register", ctrl.registerPatient);

// ✅ forgot & reset password
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password/:token", ctrl.resetPassword);

router.post("/logout", ctrl.logout ?? ((req, res) => res.json({ success: true, message: "logout-stub" })));

export default router;
