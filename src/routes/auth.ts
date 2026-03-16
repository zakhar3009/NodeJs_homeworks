import express from "express";

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from "../controllers/authController";

import { validate } from "../middleware/validate";
import { auth } from "../middleware/auth";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, validate(registerSchema), registerController);
router.post("/login", jsonParser, validate(loginSchema), loginController);
router.post("/refresh", jsonParser, refreshController);
router.post("/logout", auth, logoutController);

export default router;
