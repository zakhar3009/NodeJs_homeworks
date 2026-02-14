import type { Request, Response } from "express";
import type { Book } from "../types";
import { BOOKS } from "../storage/InMemoryStorage";

export function getBooks(req: Request, res: Response) {
  res.json({ data: BOOKS });
}

export function getBookById(req: Request, res: Response) {
  const { id } = req.params;
  const book = BOOKS.find((book) => book.id === id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json({ data: book });
}

export function createBook(req: Request, res: Response) {
  const { title, author, year, isbn } = req.body;
  const existingBook = BOOKS.find((book) => book.isbn === isbn);
  if (existingBook) {
    return res.status(409).json({ error: "Book with this ISBN already exists" });
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
  res.status(201).json({ data: newBook });
}

export function updateBook(req: Request, res: Response) {
  const { id } = req.params;
  const { isbn } = req.body;
  const bookIndex = BOOKS.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  const existingBook = BOOKS.find((book) => book.isbn === isbn && book.id !== id);
  if (existingBook) {
    return res.status(409).json({ error: "Book with this ISBN already exists" });
  }
  BOOKS[bookIndex] = {
    ...BOOKS[bookIndex],
    ...req.body,
  };
  res.json({ data: BOOKS[bookIndex] });
}

export function deleteBook(req: Request, res: Response) {
  const { id } = req.params;
  const bookIndex = BOOKS.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  BOOKS.splice(bookIndex, 1);
  res.status(204).end();
}
