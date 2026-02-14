import type { Request, Response } from "express";
import type { User } from "../types";
import { USERS } from "../storage/InMemoryStorage";

export function getUsers(req: Request, res: Response) {
  res.json({ data: USERS });
}

export function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const user = USERS.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ data: user });
}

export function createUser(req: Request, res: Response) {
  const { name, email } = req.body;
  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "User with this email already exists" });
  }
  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
  };
  USERS.push(newUser);
  res.status(201).json({ data: newUser });
}
