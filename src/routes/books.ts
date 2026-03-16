import express from "express";
import * as BookController from "../controllers/bookController";
import { validate } from "../middleware/validate";
import { auth, requireAdmin } from "../middleware/auth";
import { createBookSchema, updateBookSchema } from "../schemas/book.schema";

const router = express.Router();
const jsonParser = express.json();

router.get("/", BookController.getBooks);
router.get("/:id", BookController.getBookById);
router.post("/", jsonParser, auth, requireAdmin, validate(createBookSchema), BookController.createBook);
router.put("/:id", jsonParser, auth, requireAdmin, validate(updateBookSchema), BookController.updateBook);
router.delete("/:id", auth, requireAdmin, BookController.deleteBook);

export default router;
