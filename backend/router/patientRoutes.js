// backend/router/patientRoutes.js
import express from "express";
const router = express.Router();

async function loadController() {
  const candidates = ["../controller/patientController.js","../controller/patientController.js"];
  for (const p of candidates) {
    try { const m = await import(p); console.log(`[router:patients] loaded ${p}`); return m; } catch {}
  }
  console.warn("[router:patients] patientController not found — stubs active.");
  return {};
}
const ctrl = await loadController();

const list = ctrl.getAllPatients ?? ((req,res)=>res.json({ success:true, data: [] }));
router.get("/", list);

if (ctrl.createPatient) router.post("/", ctrl.createPatient);
if (ctrl.getPatient) router.get("/:id", ctrl.getPatient);
if (ctrl.updatePatient) router.put("/:id", ctrl.updatePatient);
if (ctrl.deletePatient) router.delete("/:id", ctrl.deletePatient);

export default router;
