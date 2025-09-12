import express from "express";
import * as ctrl from "../controller/postController.js";
import { isAuth, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public
router.get("/", ctrl.getPosts);
router.get("/:slug", ctrl.getPostBySlug);

// Admin
router.post("/", isAuth, isAdmin, ctrl.createPost);
router.put("/:id", isAuth, isAdmin, ctrl.updatePost);
router.delete("/:id", isAuth, isAdmin, ctrl.deletePost);

export default router;
