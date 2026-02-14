import * as z from "zod";

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters"),
  year: z.number().int(),
  isbn: z
    .string()
    .min(1, "ISBN is required")
    .max(20, "ISBN must be less than 20 characters"),
});

export const updateBookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters"),
  year: z.number().int(),
  isbn: z
    .string()
    .min(1, "ISBN is required")
    .max(20, "ISBN must be less than 20 characters"),
});

export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
