import type { Request, Response } from "express";
import { AppError } from "../../middlewares/errorHandler.js";
import { addMemberSchema, createBoardSchema, updateBoardSchema } from "./boards.schema.js";
import {
  addMember,
  createBoard,
  deleteBoard,
  listBoardsForUser,
  removeMember,
  updateBoard,
} from "./boards.service.js";

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
  res.status(200).json(req.board);
}

export async function update(req: Request, res: Response) {
  const parsed = updateBoardSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const board = await updateBoard(req.params.id as string, parsed.data);
  res.status(200).json(board);
}

export async function remove(req: Request, res: Response) {
  await deleteBoard(req.params.id as string);
  res.status(204).send();
}

export async function addMemberByEmail(req: Request, res: Response) {
  const parsed = addMemberSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const membership = await addMember(req.params.id as string, parsed.data);
  res.status(201).json(membership);
}

export async function removeMemberById(req: Request, res: Response) {
  await removeMember(req.params.id as string, req.params.userId as string);
  res.status(204).send();
}
