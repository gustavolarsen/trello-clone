import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(1, "titulo e obrigatorio"),
  description: z.string().optional(),
  color: z.string().min(1, "cor e obrigatoria"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
