// backend/router/adminUserRoutes.js
import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userAdminController.js";

const router = express.Router();

router.get("/", getUsers);        // GET /api/v1/admin/users
router.post("/", createUser);     // POST /api/v1/admin/users
router.put("/:id", updateUser);   // PUT /api/v1/admin/users/:id
router.delete("/:id", deleteUser);// DELETE /api/v1/admin/users/:id

export default router;
