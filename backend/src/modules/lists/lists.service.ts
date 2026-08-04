import { prisma } from "../../lib/prisma.js";
import type { CreateListInput } from "./lists.schema.js";

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
