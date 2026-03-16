import type { Request, Response } from "express";
import * as BookService from "../services/bookService";

export async function getBooks(req: Request, res: Response) {
  const books = await BookService.getAllBooks();
  res.json({ data: books });
}

export async function getBookById(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const result = await BookService.getBookById(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ data: result.data });
}

export async function createBook(req: Request, res: Response) {
  const { title, author, year, isbn } = req.body;
  const result = await BookService.createBook(title, author, year, isbn);
  if (!result.success) {
    return res.status(409).json({ error: result.error });
  }
  res.status(201).json({ data: result.data });
}

export async function updateBook(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const { title, author, year, isbn } = req.body;
  const result = await BookService.updateBook(id, title, author, year, isbn);
  if (!result.success) {
    const statusCode = result.error === "Book not found" ? 404 : 409;
    return res.status(statusCode).json({ error: result.error });
  }
  res.json({ data: result.data });
}

export async function deleteBook(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const result = await BookService.deleteBook(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.status(204).end();
}
