import express from "express";
import {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../controller/inventoryController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Admin hoặc Dentist mới quản lý, Patient chỉ xem
router.get("/", isAuthenticatedUser, getAllInventory);
router.get("/:id", isAuthenticatedUser, getInventoryById);
router.post("/", isAuthenticatedUser, authorizeRoles("Admin", "Dentist"), createInventory);
router.put("/:id", isAuthenticatedUser, authorizeRoles("Admin", "Dentist"), updateInventory);
router.delete("/:id", isAuthenticatedUser, authorizeRoles("Admin"), deleteInventory);

export default router;
