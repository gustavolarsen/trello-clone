import type { Request, Response } from "express";
import { AppError } from "../../middlewares/errorHandler.js";
import { createListSchema } from "./lists.schema.js";
import { createList } from "./lists.service.js";

export async function create(req: Request, res: Response) {
  const parsed = createListSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const list = await createList(req.params.boardId as string, parsed.data);
  res.status(201).json(list);
}
