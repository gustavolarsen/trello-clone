import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { create, list } from "./boards.controller.js";

export const boardsRouter = Router();

boardsRouter.post("/", requireAuth, create);
boardsRouter.get("/", requireAuth, list);
