import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./modules/auth/auth.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
