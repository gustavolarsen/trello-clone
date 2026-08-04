import type { Request, Response } from "express";
import { AppError } from "../../middlewares/errorHandler.js";
import { createBoardSchema } from "./boards.schema.js";
import { createBoard, getBoardById, listBoardsForUser } from "./boards.service.js";

export async function create(req: Request, res: Response) {
  const parsed = createBoardSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const board = await createBoard(parsed.data, req.userId as string);
  res.status(201).json(board);
}

export async function list(req: Request, res: Response) {
  const boards = await listBoardsForUser(req.userId as string);
  res.status(200).json(boards);
}

export async function getById(req: Request, res: Response) {
  const board = await getBoardById(req.params.id as string, req.userId as string);
  res.status(200).json(board);
}
