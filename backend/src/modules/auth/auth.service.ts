import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";

const SALT_ROUNDS = 10;

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
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
