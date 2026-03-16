import prisma from "../lib/prisma";

export async function getAllBooks() {
  return prisma.book.findMany();
}

export async function getBookById(id: number) {
  const book = await prisma.book.findUnique({ where: { id } });
  if (book === null) {
    return { success: false as const, error: "Book not found" };
  }
  return { success: true as const, data: book };
}

export async function createBook(title: string, author: string, year: number, isbn: string) {
  const existingBook = await prisma.book.findUnique({ where: { isbn } });
  if (existingBook !== null) {
    return { success: false as const, error: "Book with this ISBN already exists" };
  }
  const newBook = await prisma.book.create({
    data: { title, author, year, isbn },
  });
  return { success: true as const, data: newBook };
}

export async function updateBook(id: number, title: string, author: string, year: number, isbn: string) {
  const existingBook = await prisma.book.findFirst({
    where: { isbn, NOT: { id } },
  });
  if (existingBook !== null) {
    return { success: false as const, error: "Book with this ISBN already exists" };
  }
  try {
    const book = await prisma.book.update({
      where: { id },
      data: { title, author, year, isbn },
    });
    return { success: true as const, data: book };
  } catch {
    return { success: false as const, error: "Book not found" };
  }
}

export async function deleteBook(id: number) {
  try {
    await prisma.book.delete({ where: { id } });
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Book not found" };
  }
}
