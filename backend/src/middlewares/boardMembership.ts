import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "./errorHandler.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      board?: Awaited<ReturnType<typeof prisma.board.findUniqueOrThrow>>;
    }
  }
}

export async function requireBoardMembership(req: Request, _res: Response, next: NextFunction) {
  const boardId = req.params.id as string;
  const userId = req.userId as string;

  const board = await prisma.board.findUnique({ where: { id: boardId } });

  if (!board) {
    throw new AppError("board nao encontrado", 404);
  }

  const membership = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId, userId } },
  });

  if (!membership) {
    throw new AppError("usuario nao e membro deste board", 403);
  }

  req.board = board;
  next();
}
