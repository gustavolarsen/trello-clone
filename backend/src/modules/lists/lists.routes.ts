import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireBoardMembership } from "../../middlewares/boardMembership.js";
import { archive, create, list, update } from "./lists.controller.js";

export const listsRouter = Router({ mergeParams: true });

listsRouter.post("/", requireAuth, requireBoardMembership("boardId"), create);
listsRouter.get("/", requireAuth, requireBoardMembership("boardId"), list);
listsRouter.patch("/:listId", requireAuth, requireBoardMembership("boardId"), update);
listsRouter.patch(
  "/:listId/archive",
  requireAuth,
  requireBoardMembership("boardId"),
  archive,
);
