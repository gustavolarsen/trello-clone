import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { addMemberByEmail, create, getById, list, remove, update } from "./boards.controller.js";

export const boardsRouter = Router();

boardsRouter.post("/", requireAuth, create);
boardsRouter.get("/", requireAuth, list);
boardsRouter.get("/:id", requireAuth, getById);
boardsRouter.patch("/:id", requireAuth, update);
boardsRouter.delete("/:id", requireAuth, remove);
boardsRouter.post("/:id/members", requireAuth, addMemberByEmail);
