// backend/routes/chatbotRoutes.js
import express from "express";
import { chatWithBot } from "../controller/chatbotController.js";

const router = express.Router();

// public chat endpoint (optional: protect for logged-in features)
router.post("/chatbot", /* requireAuth, */ chatWithBot);

export default router;
