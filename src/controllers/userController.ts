import type { Request, Response } from "express";
import * as UserService from "../services/userService";
import type { RequestWithUser } from "../middleware/auth";

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
