import express from "express";
import * as LoanController from "../controllers/loanController";
import { validate } from "../middleware/validate";
import { auth } from "../middleware/auth";
import { createLoanSchema } from "../schemas/loan.schema";

const router = express.Router();
const jsonParser = express.json();

router.get("/", auth, LoanController.getLoans);
router.post("/", jsonParser, auth, validate(createLoanSchema), LoanController.createLoan);
router.post("/:id/return", auth, LoanController.returnLoan);

export default router;
