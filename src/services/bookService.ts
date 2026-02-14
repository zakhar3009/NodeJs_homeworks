import type { Book } from "../types";
import { BOOKS } from "../storage/InMemoryStorage";

export function getAllBooks(): Book[] {
  return BOOKS;
}

export function getBookById(id: string): {
  success: boolean;
  data?: Book;
  error?: string;
} {
  const book = BOOKS.find((book) => book.id === id);
  if (!book) {
    return { success: false, error: "Book not found" };
  }
  return { success: true, data: book };
}

export function createBook(
  title: string,
  author: string,
  year: number,
  isbn: string
): {
  success: boolean;
  data?: Book;
  error?: string;
} {
  const existingBook = BOOKS.find((book) => book.isbn === isbn);
  if (existingBook) {
    return { success: false, error: "Book with this ISBN already exists" };
  }
  const newBook: Book = {
    id: crypto.randomUUID(),
    title,
    author,
    year,
    isbn,
    available: true,
  };
  BOOKS.push(newBook);
  return { success: true, data: newBook };
}

export function updateBook(
  id: string,
  title: string,
  author: string,
  year: number,
  isbn: string
): {
  success: boolean;
  data?: Book;
  error?: string;
} {
  const bookIndex = BOOKS.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return { success: false, error: "Book not found" };
  }
  const existingBook = BOOKS.find((book) => book.isbn === isbn && book.id !== id);
  if (existingBook) {
    return { success: false, error: "Book with this ISBN already exists" };
  }
  BOOKS[bookIndex] = {
    ...BOOKS[bookIndex],
    title,
    author,
    year,
    isbn,
  };
  return { success: true, data: BOOKS[bookIndex] };
}

export function deleteBook(id: string): {
  success: boolean;
  error?: string;
} {
  const bookIndex = BOOKS.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return { success: false, error: "Book not found" };
  }
  BOOKS.splice(bookIndex, 1);
  return { success: true };
}
