import express from "express";
import * as UserController from "../controllers/userController";
import { auth, requireAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

router.get("/me", auth, UserController.getMe);
router.post("/me/avatar", auth, upload.single("avatar"), UserController.uploadAvatar);
router.delete("/me/avatar", auth, UserController.deleteAvatar);
router.get("/", auth, requireAdmin, UserController.getUsers);
router.get("/:id", auth, requireAdmin, UserController.getUserById);

export default router;
