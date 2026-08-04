import { AppError } from "../../middlewares/errorHandler.js";
import { prisma } from "../../lib/prisma.js";
import type { AddMemberInput, CreateBoardInput, UpdateBoardInput } from "./boards.schema.js";

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

export async function updateBoard(boardId: string, input: UpdateBoardInput) {
  return prisma.board.update({
    where: { id: boardId },
    data: input,
  });
}

export async function deleteBoard(boardId: string) {
  await prisma.boardMember.deleteMany({ where: { boardId } });
  await prisma.board.delete({ where: { id: boardId } });
}

export async function addMember(boardId: string, input: AddMemberInput) {
  const invitedUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (!invitedUser) {
    throw new AppError("usuario nao encontrado", 404);
  }

  return prisma.boardMember.create({
    data: { boardId, userId: invitedUser.id },
  });
}

export async function removeMember(boardId: string, memberUserId: string) {
  await prisma.boardMember.deleteMany({ where: { boardId, userId: memberUserId } });
}

export async function listBoardsForUser(userId: string) {
  return prisma.board.findMany({
    where: { members: { some: { userId } } },
  });
}
