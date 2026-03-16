import express from "express";
import * as UserController from "../controllers/userController";
import { auth, requireAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/me", auth, UserController.getMe);
router.get("/", auth, requireAdmin, UserController.getUsers);
router.get("/:id", auth, requireAdmin, UserController.getUserById);

export default router;
