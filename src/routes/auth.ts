import express from "express";

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  requestPasswordResetController,
  resetPasswordController,
} from "../controllers/authController";

import { validate } from "../middleware/validate";
import { auth } from "../middleware/auth";
import {
  registerSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, validate(registerSchema), registerController);
router.post("/login", jsonParser, validate(loginSchema), loginController);
router.post("/refresh", jsonParser, refreshController);
router.post("/logout", auth, logoutController);
router.post("/request-password-reset", jsonParser, validate(requestPasswordResetSchema), requestPasswordResetController);
router.post("/reset-password", jsonParser, validate(resetPasswordSchema), resetPasswordController);

export default router;
