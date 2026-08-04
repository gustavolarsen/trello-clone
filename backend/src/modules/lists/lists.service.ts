import { AppError } from "../../middlewares/errorHandler.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateListInput, UpdateListInput } from "./lists.schema.js";

export async function createList(boardId: string, input: CreateListInput) {
  const listCount = await prisma.list.count({ where: { boardId } });

  return prisma.list.create({
    data: {
      title: input.title,
      boardId,
      position: listCount,
    },
  });
}

export async function listListsForBoard(boardId: string) {
  return prisma.list.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
  });
}

export async function updateList(boardId: string, listId: string, input: UpdateListInput) {
  const list = await prisma.list.findUnique({ where: { id: listId } });

  if (!list || list.boardId !== boardId) {
    throw new AppError("lista nao encontrada", 404);
  }

  return prisma.list.update({
    where: { id: listId },
    data: { title: input.title },
  });
}
