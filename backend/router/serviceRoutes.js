// backend/router/serviceRoutes.js
import express from "express";
import * as ctrl from "../controller/serviceController.js";
const router = express.Router();

router.get("/", ctrl.getAllServices);
router.get("/:id", ctrl.getServiceById);
router.post("/", ctrl.createService);
router.put("/:id", ctrl.updateService);
router.delete("/:id", ctrl.deleteService);

export default router;
