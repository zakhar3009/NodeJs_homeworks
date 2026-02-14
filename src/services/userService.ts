import type { User } from "../types";
import { USERS } from "../storage/InMemoryStorage";

export function getAllUsers(): User[] {
  return USERS;
}

export function getUserById(id: string): {
  success: boolean;
  data?: User;
  error?: string;
} {
  const user = USERS.find((user) => user.id === id);
  if (!user) {
    return { success: false, error: "User not found" };
  }
  return { success: true, data: user };
}

export function createUser(name: string, email: string): {
  success: boolean;
  data?: User;
  error?: string;
} {
  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    return { success: false, error: "User with this email already exists" };
  }
  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
  };
  USERS.push(newUser);
  return { success: true, data: newUser };
}
