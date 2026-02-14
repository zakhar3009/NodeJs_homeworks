import type { Request, Response } from "express";
import * as LoanService from "../services/loanService";

export function getLoans(req: Request, res: Response) {
  const loans = LoanService.getAllLoans();
  res.json({ data: loans });
}

export function createLoan(req: Request, res: Response) {
  const { userId, bookId } = req.body;
  const result = LoanService.createLoan(userId, bookId);
  if (!result.success) {
    return res.status(409).json({ error: result.error });
  }
  res.status(201).json({ data: result.data });
}

export function returnLoan(req: Request, res: Response) {
  const { id } = req.params;
  const result = LoanService.returnLoan(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ data: result.data });
}
