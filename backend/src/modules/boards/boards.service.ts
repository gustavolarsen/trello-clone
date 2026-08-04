import { AppError } from "../../middlewares/errorHandler.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateBoardInput } from "./boards.schema.js";

export async function createBoard(input: CreateBoardInput, ownerId: string) {
  const board = await prisma.board.create({
    data: {
      title: input.title,
      description: input.description,
      color: input.color,
      members: {
        create: { userId: ownerId },
      },
    },
  });

  return board;
}

export async function listBoardsForUser(userId: string) {
  return prisma.board.findMany({
    where: { members: { some: { userId } } },
  });
}

export async function getBoardById(boardId: string, userId: string) {
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

  return board;
}
