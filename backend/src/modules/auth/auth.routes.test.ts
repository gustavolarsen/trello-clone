import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";

afterEach(async () => {
  await prisma.user.deleteMany();
});

describe("POST /auth/register", () => {
  it("cria um usuario com dados validos e retorna 201", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Maria Silva",
      email: "maria@example.com",
      password: "senha123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Maria Silva",
      email: "maria@example.com",
    });
    expect(response.body.id).toBeTypeOf("string");
  });
});
