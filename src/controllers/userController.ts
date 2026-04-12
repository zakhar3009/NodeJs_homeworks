import * as fs from "node:fs/promises";
import path from "node:path";

import type { Request, Response } from "express";
import * as UserService from "../services/userService";
import type { RequestWithUser } from "../middleware/auth";
import prisma from "../lib/prisma";

export async function getUsers(req: Request, res: Response) {
  const users = await UserService.getAllUsers();
  res.json({ data: users });
}

export async function getUserById(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const result = await UserService.getUserById(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ data: result.data });
}

export async function getMe(req: Request, res: Response) {
  const id = (req as RequestWithUser).user.id;
  const result = await UserService.getUserById(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ data: result.data });
}

export async function uploadAvatar(req: Request, res: Response) {
  const userId = (req as RequestWithUser).user.id;

  if (req.file === undefined) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const destPath = path.resolve("src", "uploads", "avatars", fileName);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.avatarUrl !== null && user?.avatarUrl !== undefined) {
    const oldFilePath = path.resolve("src", "uploads", "avatars", path.basename(user.avatarUrl));
    try {
      await fs.unlink(oldFilePath);
    } catch {}
  }

  await fs.rename(filePath, destPath);

  const avatarUrl = `/avatars/${fileName}`;

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
  });

  res.json({ message: "Avatar updated successfully", avatarUrl });
}

export async function deleteAvatar(req: Request, res: Response) {
  const userId = (req as RequestWithUser).user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.avatarUrl === null || user?.avatarUrl === undefined) {
    return res.status(404).json({ error: "Avatar not found" });
  }

  const filePath = path.resolve("src", "uploads", "avatars", path.basename(user.avatarUrl));

  try {
    await fs.unlink(filePath);
  } catch {}

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: null },
  });

  res.json({ message: "Avatar deleted successfully" });
}
