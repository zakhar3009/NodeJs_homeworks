import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

import type { Request, Response } from "express";

import type { RegisterDTO, LoginDTO } from "../schemas/auth.schema";
import type { RequestWithUser } from "../middleware/auth";
import type { JWTPayload } from "../types/jwt";

import prisma from "../lib/prisma";
import CONFIG from "../config";

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

export async function logoutController(req: Request, res: Response) {
  const userId = (req as RequestWithUser).user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  res.json({ message: "Logged out successfully" });
}
