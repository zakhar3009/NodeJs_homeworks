import type { Request, Response } from "express";
import * as BookService from "../services/bookService";

export function getBooks(req: Request, res: Response) {
  const books = BookService.getAllBooks();
  res.json({ data: books });
}

export function getBookById(req: Request, res: Response) {
  const { id } = req.params;
  const result = BookService.getBookById(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ data: result.data });
}

export function createBook(req: Request, res: Response) {
  const { title, author, year, isbn } = req.body;
  const result = BookService.createBook(title, author, year, isbn);
  if (!result.success) {
    return res.status(409).json({ error: result.error });
  }
  res.status(201).json({ data: result.data });
}

export function updateBook(req: Request, res: Response) {
  const { id } = req.params;
  const { title, author, year, isbn } = req.body;
  const result = BookService.updateBook(id, title, author, year, isbn);
  if (!result.success) {
    const statusCode = result.error === "Book not found" ? 404 : 409;
    return res.status(statusCode).json({ error: result.error });
  }
  res.json({ data: result.data });
}

export function deleteBook(req: Request, res: Response) {
  const { id } = req.params;
  const result = BookService.deleteBook(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.status(204).end();
}
