import express from "express";

import bookRouter from "./books";
import userRouter from "./users";
import loanRouter from "./loans";

const router = express.Router();

router.use("/books", bookRouter);
router.use("/users", userRouter);
router.use("/loans", loanRouter);

export default router;
