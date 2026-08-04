import bcrypt from "bcrypt";
import { AppError } from "../../middlewares/errorHandler.js";
import { prisma } from "../../lib/prisma.js";
import { generateToken } from "../../lib/token.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

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

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError("credenciais invalidas", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new AppError("credenciais invalidas", 401);
  }

  const token = generateToken({ sub: user.id });

  return { token };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError("usuario nao encontrado", 404);
  }

  const { password: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
