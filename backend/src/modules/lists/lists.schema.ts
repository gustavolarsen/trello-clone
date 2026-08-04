import { z } from "zod";

export const createListSchema = z.object({
  title: z.string().min(1, "titulo e obrigatorio"),
});

export type CreateListInput = z.infer<typeof createListSchema>;

export const updateListSchema = z.object({
  title: z.string().min(1, "titulo e obrigatorio"),
});

export type UpdateListInput = z.infer<typeof updateListSchema>;
