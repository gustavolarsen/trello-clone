import { prisma } from "../../lib/prisma.js";
import type { CreateBoardInput } from "./boards.schema.js";

export async function createBoard(input: CreateBoardInput) {
  const board = await prisma.board.create({
    data: {
      title: input.title,
      description: input.description,
      color: input.color,
    },
  });

  return board;
}
