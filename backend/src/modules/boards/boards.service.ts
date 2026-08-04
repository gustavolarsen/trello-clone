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
