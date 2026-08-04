import type { Request, Response } from "express";
import { AppError } from "../../middlewares/errorHandler.js";
import { registerSchema } from "./auth.schema.js";
import { registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "dados invalidos", 400);
  }

  const user = await registerUser(parsed.data);
  res.status(201).json(user);
}
