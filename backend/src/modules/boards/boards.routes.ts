import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { requireBoardMembership } from "../../middlewares/boardMembership.js";
import {
  addMemberByEmail,
  create,
  getById,
  list,
  remove,
  removeMemberById,
  update,
} from "./boards.controller.js";

export const boardsRouter = Router();

boardsRouter.post("/", requireAuth, create);
boardsRouter.get("/", requireAuth, list);
boardsRouter.get("/:id", requireAuth, requireBoardMembership, getById);
boardsRouter.patch("/:id", requireAuth, requireBoardMembership, update);
boardsRouter.delete("/:id", requireAuth, requireBoardMembership, remove);
boardsRouter.post("/:id/members", requireAuth, requireBoardMembership, addMemberByEmail);
boardsRouter.delete(
  "/:id/members/:userId",
  requireAuth,
  requireBoardMembership,
  removeMemberById,
);
