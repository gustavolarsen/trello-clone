import bcrypt from "bcrypt";
import { AppError } from "../../middlewares/errorHandler.js";
import { prisma } from "../../lib/prisma.js";
import type { RegisterInput } from "./auth.schema.js";

const SALT_ROUNDS = 10;

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    throw new AppError("email ja cadastrado", 400);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });

  const { password: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
