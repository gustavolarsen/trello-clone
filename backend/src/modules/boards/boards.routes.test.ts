import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";

afterEach(async () => {
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();
});

async function registerAndLogin(email = "maria@example.com") {
  await request(app).post("/auth/register").send({
    name: "Maria Silva",
    email,
    password: "senha123",
  });

  const loginResponse = await request(app).post("/auth/login").send({
    email,
    password: "senha123",
  });

  return loginResponse.body.token as string;
}

describe("POST /boards", () => {
  it("cria um board com dados validos e retorna 201", async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Projeto X",
        description: "Board do projeto X",
        color: "#FF5733",
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Projeto X",
      description: "Board do projeto X",
      color: "#FF5733",
    });
    expect(response.body.id).toBeTypeOf("string");
  });

  it("retorna 401 sem token de autenticacao", async () => {
    const response = await request(app).post("/boards").send({
      title: "Projeto X",
      color: "#FF5733",
    });

    expect(response.status).toBe(401);
  });

  it("retorna 400 quando o titulo esta ausente", async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        color: "#FF5733",
      });

    expect(response.status).toBe(400);
  });

  it("retorna 400 quando a cor esta ausente", async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Projeto X",
      });

    expect(response.status).toBe(400);
  });
});
