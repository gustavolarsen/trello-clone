import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { AppError, errorHandler } from "./errorHandler.js";

function buildTestApp() {
  const app = express();

  app.get("/known-error", () => {
    throw new AppError("board nao encontrado", 404);
  });

  app.get("/unknown-error", () => {
    throw new Error("algo inesperado");
  });

  app.use(errorHandler);

  return app;
}

describe("errorHandler", () => {
  it("retorna o status e a mensagem de um AppError", async () => {
    const response = await request(buildTestApp()).get("/known-error");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "board nao encontrado" });
  });

  it("retorna 500 e mensagem generica para erros nao mapeados", async () => {
    const response = await request(buildTestApp()).get("/unknown-error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "internal server error" });
  });
});
