import { z } from "zod";

export const createListSchema = z.object({
  title: z.string().min(1, "titulo e obrigatorio"),
});

export type CreateListInput = z.infer<typeof createListSchema>;
