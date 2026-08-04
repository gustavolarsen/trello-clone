import { prisma } from "../../lib/prisma.js";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: input.password,
    },
  });

  const { password: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
