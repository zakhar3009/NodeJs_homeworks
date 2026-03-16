import type { Request, Response } from "express";
import * as LoanService from "../services/loanService";
import type { RequestWithUser } from "../middleware/auth";

export async function getLoans(req: Request, res: Response) {
  const { id, role } = (req as RequestWithUser).user;
  const loans = await LoanService.getAllLoans(id, role);
  res.json({ data: loans });
}

export async function createLoan(req: Request, res: Response) {
  const { bookId } = req.body;
  const userId = (req as RequestWithUser).user.id;
  const result = await LoanService.createLoan(userId, bookId);
  if (!result.success) {
    return res.status(409).json({ error: result.error });
  }
  res.status(201).json({ data: result.data });
}

export async function returnLoan(req: Request, res: Response) {
  const id = parseInt(req.params.id as string, 10);
  const result = await LoanService.returnLoan(id);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ data: result.data });
}
