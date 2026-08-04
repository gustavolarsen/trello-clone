import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "nome e obrigatorio"),
  email: z.email("email invalido"),
  password: z.string().min(6, "senha deve ter no minimo 6 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("email invalido"),
  password: z.string().min(1, "senha e obrigatoria"),
});

export type LoginInput = z.infer<typeof loginSchema>;
