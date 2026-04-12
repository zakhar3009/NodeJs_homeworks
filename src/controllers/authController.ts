import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

import type { NextFunction, Request, Response } from "express";

import type { RegisterDTO, LoginDTO, RequestPasswordResetDTO, ResetPasswordDTO } from "../schemas/auth.schema";
import type { RequestWithUser } from "../middleware/auth";
import type { JWTPayload } from "../types/jwt";
import type { ResetPasswordPayload } from "../types/auth";

import prisma from "../lib/prisma";
import CONFIG from "../config";
import sendMail from "../utils/sendMail";

export async function registerController(req: Request<{}, {}, RegisterDTO>, res: Response) {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser !== null) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.json({ message: "Registration completed" });
}

export async function loginController(req: Request<{}, {}, LoginDTO>, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (user === null) {
    console.log("Email is incorrect");
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid !== true) {
    console.log("Password is incorrect");
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  const accessToken = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    CONFIG.jwtSecret,
    { expiresIn: CONFIG.jwtExpiresIn as StringValue },
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    CONFIG.jwtRefreshSecret,
    { expiresIn: CONFIG.jwtRefreshExpiresIn as StringValue },
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.json({ data: { accessToken, refreshToken } });
}

export async function refreshController(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (refreshToken === undefined) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  jwt.verify(refreshToken, CONFIG.jwtRefreshSecret, async (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Refresh token is not valid" });
      }
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Refresh token is expired" });
      }
      return res.status(401).json({ message: "Refresh token is not valid" });
    }

    const userId = (decoded as JWTPayload).id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user === null || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh token is not valid" });
    }

    const accessToken = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      CONFIG.jwtSecret,
      { expiresIn: CONFIG.jwtExpiresIn as StringValue },
    );

    res.json({ data: { accessToken } });
  });
}

export async function requestPasswordResetController(
  req: Request<{}, {}, RequestPasswordResetDTO>,
  res: Response,
) {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user !== null) {
    const token = jwt.sign(
      { email: user.email },
      CONFIG.jwtSecret,
      { expiresIn: "10m" },
    );

    try {
      await sendMail({
        to: user.email,
        subject: "Reset password",
        text: `To reset password please open this link: http://localhost:8080/reset_password?code=${token}`,
        html: `<a href="http://localhost:8080/reset_password?code=${token}">To reset password please open this link</a>`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  res.json({ message: "Message sent successfully" });
}

export async function resetPasswordController(
  req: Request<{}, {}, ResetPasswordDTO>,
  res: Response,
  next: NextFunction,
) {
  const { password, code } = req.body;

  jwt.verify(code, CONFIG.jwtSecret, async (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(400).json({ message: "Code is not valid" });
      }

      if (err.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Code is expired" });
      }

      return next(err);
    }

    const email = (decoded as ResetPasswordPayload).email;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
    } catch (error) {
      console.error(error);
    } finally {
      res.json({ message: "Password changed successfully" });
    }
  });
}

export async function logoutController(req: Request, res: Response) {
  const userId = (req as RequestWithUser).user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  res.json({ message: "Logged out successfully" });
}
