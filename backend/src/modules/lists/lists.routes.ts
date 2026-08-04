import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireBoardMembership } from "../../middlewares/boardMembership.js";
import { create } from "./lists.controller.js";

export const listsRouter = Router({ mergeParams: true });

listsRouter.post("/", requireAuth, requireBoardMembership("boardId"), create);
