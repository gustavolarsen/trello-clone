import type { Request, Response } from "express";
import { AppError } from "../../middlewares/errorHandler.js";
import { createListSchema, updateListSchema } from "./lists.schema.js";
import { createList, listListsForBoard, updateList } from "./lists.service.js";

export async function create(req: Request, res: Response) {
  const parsed = createListSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const list = await createList(req.params.boardId as string, parsed.data);
  res.status(201).json(list);
}

export async function list(req: Request, res: Response) {
  const lists = await listListsForBoard(req.params.boardId as string);
  res.status(200).json(lists);
}

export async function update(req: Request, res: Response) {
  const parsed = updateListSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const list = await updateList(
    req.params.boardId as string,
    req.params.listId as string,
    parsed.data,
  );
  res.status(200).json(list);
}
