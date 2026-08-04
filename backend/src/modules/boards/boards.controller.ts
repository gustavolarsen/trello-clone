import type { Request, Response } from "express";
import { AppError } from "../../middlewares/errorHandler.js";
import { createBoardSchema } from "./boards.schema.js";
import { createBoard } from "./boards.service.js";

export async function create(req: Request, res: Response) {
  const parsed = createBoardSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const board = await createBoard(parsed.data, req.userId as string);
  res.status(201).json(board);
}
