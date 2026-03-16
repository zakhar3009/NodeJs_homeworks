import * as z from "zod";

export const createLoanSchema = z.object({
  bookId: z.number().int(),
});

export type CreateLoanDto = z.infer<typeof createLoanSchema>;
