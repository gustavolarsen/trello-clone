import type { Request, Response } from "express";
import { AppError } from "../../middlewares/errorHandler.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { getUserById, loginUser, registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const user = await registerUser(parsed.data);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const result = await loginUser(parsed.data);
  res.status(200).json(result);
}

export async function me(req: Request, res: Response) {
  const user = await getUserById(req.userId as string);
  res.status(200).json(user);
}
