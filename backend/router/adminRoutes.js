// backend/router/adminRoutes.js
import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userAdminController.js"; 

const router = express.Router();

async function loadController() {
  const candidates = ["../controller/adminController.js","../controllers/adminController.js"];
  for (const p of candidates) {
    try { const m = await import(p); console.log(`[router:admin] loaded ${p}`); return m; } catch {}
  }
  console.warn("[router:admin] adminController not found — stubs active.");
  return {};
}
const ctrl = await loadController();

router.get("/", ctrl.dashboard ?? ((req,res)=>res.json({ success:true, message: "admin root (stub)" })));

export default router;
