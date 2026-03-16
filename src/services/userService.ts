import prisma from "../lib/prisma";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export async function getAllUsers() {
  return prisma.user.findMany({ select: userSelect });
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
  if (user === null) {
    return { success: false as const, error: "User not found" };
  }
  return { success: true as const, data: user };
}
