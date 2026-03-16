import prisma from "../lib/prisma";

export async function getAllLoans(userId: number, role: string) {
  if (role === "ADMIN") {
    return prisma.loan.findMany();
  }
  return prisma.loan.findMany({ where: { userId } });
}

export async function createLoan(userId: number, bookId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user === null) {
    return { success: false as const, error: "User not found" };
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (book === null) {
    return { success: false as const, error: "Book not found" };
  }

  if (!book.available) {
    return { success: false as const, error: "Book is not available" };
  }

  const activeLoan = await prisma.loan.findFirst({
    where: { bookId, status: "ACTIVE" },
  });
  if (activeLoan !== null) {
    return { success: false as const, error: "Book already has an active loan" };
  }

  const loan = await prisma.loan.create({ data: { userId, bookId } });

  await prisma.book.update({
    where: { id: bookId },
    data: { available: false },
  });

  return { success: true as const, data: loan };
}

export async function returnLoan(id: number) {
  const loan = await prisma.loan.findUnique({ where: { id } });
  if (loan === null) {
    return { success: false as const, error: "Loan not found" };
  }

  if (loan.status !== "ACTIVE") {
    return { success: false as const, error: "Loan is not active" };
  }

  const updatedLoan = await prisma.loan.update({
    where: { id },
    data: { status: "RETURNED", returnDate: new Date() },
  });

  await prisma.book.update({
    where: { id: loan.bookId },
    data: { available: true },
  });

  return { success: true as const, data: updatedLoan };
}
