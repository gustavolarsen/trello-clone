import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "./errorHandler.js";
import { requireAuth } from "./auth.js";

function buildTestApp() {
  const app = express();

  app.get("/protected", requireAuth, (req, res) => {
    res.json({ userId: req.userId });
  });

  app.use(errorHandler);

  return app;
}

describe("requireAuth", () => {
  it("permite acesso e injeta userId com um token valido", async () => {
    const token = jwt.sign({ sub: "user-123" }, process.env.JWT_SECRET as string);

    const response = await request(buildTestApp())
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId: "user-123" });
  });

  it("retorna 401 quando nao ha header de autorizacao", async () => {
    const response = await request(buildTestApp()).get("/protected");

    expect(response.status).toBe(401);
  });

  it("retorna 401 quando o token e invalido", async () => {
    const response = await request(buildTestApp())
      .get("/protected")
      .set("Authorization", "Bearer token-invalido");

    expect(response.status).toBe(401);
  });
});
