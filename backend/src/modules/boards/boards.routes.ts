import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { create } from "./boards.controller.js";

export const boardsRouter = Router();

boardsRouter.post("/", requireAuth, create);
