import { z } from "zod";

export const createListSchema = z.object({
  title: z.string().min(1, "titulo e obrigatorio"),
});

export type CreateListInput = z.infer<typeof createListSchema>;

export const updateListSchema = z.object({
  title: z.string().min(1, "titulo e obrigatorio"),
});

export type UpdateListInput = z.infer<typeof updateListSchema>;

export const reorderListsSchema = z.object({
  listIds: z.array(z.string().min(1)),
});

export type ReorderListsInput = z.infer<typeof reorderListsSchema>;
