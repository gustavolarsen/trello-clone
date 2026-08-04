import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireBoardMembership } from "../../middlewares/boardMembership.js";
import { create, list } from "./lists.controller.js";

export const listsRouter = Router({ mergeParams: true });

listsRouter.post("/", requireAuth, requireBoardMembership("boardId"), create);
listsRouter.get("/", requireAuth, requireBoardMembership("boardId"), list);
