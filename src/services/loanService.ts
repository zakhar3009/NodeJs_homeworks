import type { Loan } from "../types";
import { BOOKS, USERS, LOANS } from "../storage/InMemoryStorage";

export function createLoan(userId: string, bookId: string): {
  success: boolean;
  data?: Loan;
  error?: string;
} {
  const user = USERS.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: "User not found" };
  }
  const book = BOOKS.find((b) => b.id === bookId);
  if (!book) {
    return { success: false, error: "Book not found" };
  }
  if (!book.available) {
    return { success: false, error: "Book is not available" };
  }
  const activeLoan = LOANS.find(
    (l) => l.bookId === bookId && l.status === "ACTIVE"
  );
  if (activeLoan) {
    return { success: false, error: "Book already has an active loan" };
  }
  const loan: Loan = {
    id: crypto.randomUUID(),
    userId,
    bookId,
    loanDate: new Date(),
    returnDate: null,
    status: "ACTIVE",
  };
  LOANS.push(loan);
  book.available = false;
  return { success: true, data: loan };
}

export function returnLoan(loanId: string): {
  success: boolean;
  data?: Loan;
  error?: string;
} {
  const loan = LOANS.find((l) => l.id === loanId);
  if (!loan) {
    return { success: false, error: "Loan not found" };
  }
  if (loan.status !== "ACTIVE") {
    return { success: false, error: "Loan is not active" };
  }
  loan.returnDate = new Date();
  loan.status = "RETURNED";
  const book = BOOKS.find((b) => b.id === loan.bookId);
  if (book) {
    book.available = true;
  }
  return { success: true, data: loan };
}

export function getAllLoans(): Loan[] {
  return LOANS;
}
