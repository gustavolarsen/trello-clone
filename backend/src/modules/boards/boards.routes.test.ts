import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";

afterEach(async () => {
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();
});

async function registerAndLogin(email = "board-owner@example.com") {
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

  it("torna o criador membro do board automaticamente", async () => {
    const token = await registerAndLogin();
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "board-owner@example.com" },
    });

    const response = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Projeto X",
        color: "#FF5733",
      });

    const membership = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId: response.body.id,
          userId: user.id,
        },
      },
    });

    expect(membership).not.toBeNull();
  });
});

describe("GET /boards", () => {
  it("lista apenas os boards em que o usuario e membro", async () => {
    const tokenA = await registerAndLogin("board-owner@example.com");
    const tokenB = await registerAndLogin("outra-usuaria@example.com");

    await request(app).post("/boards").set("Authorization", `Bearer ${tokenA}`).send({
      title: "Board da Maria",
      color: "#FF5733",
    });

    await request(app).post("/boards").set("Authorization", `Bearer ${tokenB}`).send({
      title: "Board da Outra",
      color: "#33FF57",
    });

    const response = await request(app)
      .get("/boards")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({ title: "Board da Maria" });
  });

  it("retorna 401 sem token de autenticacao", async () => {
    const response = await request(app).get("/boards");

    expect(response.status).toBe(401);
  });
});

describe("GET /boards/:id", () => {
  it("retorna o board quando o usuario e membro", async () => {
    const token = await registerAndLogin("board-owner@example.com");

    const createResponse = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Board da Maria", color: "#FF5733" });

    const response = await request(app)
      .get(`/boards/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ title: "Board da Maria" });
  });

  it("retorna 403 quando o usuario nao e membro do board", async () => {
    const tokenA = await registerAndLogin("board-owner@example.com");
    const tokenB = await registerAndLogin("outra-usuaria@example.com");

    const createResponse = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Board da Maria", color: "#FF5733" });

    const response = await request(app)
      .get(`/boards/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(403);
  });

  it("retorna 404 quando o board nao existe", async () => {
    const token = await registerAndLogin("board-owner@example.com");

    const response = await request(app)
      .get("/boards/id-inexistente")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("retorna 401 sem token de autenticacao", async () => {
    const response = await request(app).get("/boards/id-qualquer");

    expect(response.status).toBe(401);
  });
});

describe("PATCH /boards/:id", () => {
  it("edita titulo, descricao e cor quando o usuario e membro", async () => {
    const token = await registerAndLogin("board-owner@example.com");

    const createResponse = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Board da Maria", color: "#FF5733" });

    const response = await request(app)
      .patch(`/boards/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Novo titulo", description: "Nova descricao", color: "#000000" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      title: "Novo titulo",
      description: "Nova descricao",
      color: "#000000",
    });
  });

  it("retorna 403 quando o usuario nao e membro do board", async () => {
    const tokenA = await registerAndLogin("board-owner@example.com");
    const tokenB = await registerAndLogin("outra-usuaria@example.com");

    const createResponse = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Board da Maria", color: "#FF5733" });

    const response = await request(app)
      .patch(`/boards/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "Novo titulo" });

    expect(response.status).toBe(403);
  });

  it("retorna 404 quando o board nao existe", async () => {
    const token = await registerAndLogin("board-owner@example.com");

    const response = await request(app)
      .patch("/boards/id-inexistente")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Novo titulo" });

    expect(response.status).toBe(404);
  });

  it("retorna 401 sem token de autenticacao", async () => {
    const response = await request(app).patch("/boards/id-qualquer").send({ title: "x" });

    expect(response.status).toBe(401);
  });
});

describe("DELETE /boards/:id", () => {
  it("exclui o board quando o usuario e membro", async () => {
    const token = await registerAndLogin("board-owner@example.com");

    const createResponse = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Board da Maria", color: "#FF5733" });

    const response = await request(app)
      .delete(`/boards/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const boardInDb = await prisma.board.findUnique({ where: { id: createResponse.body.id } });
    expect(boardInDb).toBeNull();
  });

  it("retorna 403 quando o usuario nao e membro do board", async () => {
    const tokenA = await registerAndLogin("board-owner@example.com");
    const tokenB = await registerAndLogin("outra-usuaria@example.com");

    const createResponse = await request(app)
      .post("/boards")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Board da Maria", color: "#FF5733" });

    const response = await request(app)
      .delete(`/boards/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(403);
  });

  it("retorna 404 quando o board nao existe", async () => {
    const token = await registerAndLogin("board-owner@example.com");

    const response = await request(app)
      .delete("/boards/id-inexistente")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("retorna 401 sem token de autenticacao", async () => {
    const response = await request(app).delete("/boards/id-qualquer");

    expect(response.status).toBe(401);
  });
});
