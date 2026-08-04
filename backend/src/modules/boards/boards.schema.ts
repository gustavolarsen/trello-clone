import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(1, "titulo e obrigatorio"),
  description: z.string().optional(),
  color: z.string().min(1, "cor e obrigatoria"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = z.object({
  title: z.string().min(1, "titulo e obrigatorio").optional(),
  description: z.string().optional(),
  color: z.string().min(1, "cor e obrigatoria").optional(),
});

export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;

export const addMemberSchema = z.object({
  email: z.email("email invalido"),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
