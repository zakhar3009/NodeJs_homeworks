import type { Request, Response } from "express";
import * as UserService from "../services/userService";

export function getUsers(req: Request, res: Response) {
  const users = UserService.getAllUsers();
  res.json({ data: users });
}

export function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const result = UserService.getUserById(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ data: result.data });
}

export function createUser(req: Request, res: Response) {
  const { name, email } = req.body;
  const result = UserService.createUser(name, email);
  if (!result.success) {
    return res.status(409).json({ error: result.error });
  }
  res.status(201).json({ data: result.data });
}
