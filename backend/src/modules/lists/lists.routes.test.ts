import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";

afterEach(async () => {
  await prisma.list.deleteMany();
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

async function createBoard(token: string, title = "Board da Maria") {
  const response = await request(app)
    .post("/boards")
    .set("Authorization", `Bearer ${token}`)
    .send({ title, color: "#FF5733" });

  return response.body.id as string;
}

describe("POST /boards/:boardId/lists", () => {
  it("cria uma lista no board com dados validos e retorna 201", async () => {
    const token = await registerAndLogin();
    const boardId = await createBoard(token);

    const response = await request(app)
      .post(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "A Fazer" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: "A Fazer", boardId });
    expect(response.body.id).toBeTypeOf("string");
  });

  it("retorna 400 quando o titulo esta ausente", async () => {
    const token = await registerAndLogin();
    const boardId = await createBoard(token);

    const response = await request(app)
      .post(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("retorna 403 quando o usuario nao e membro do board", async () => {
    const tokenA = await registerAndLogin("board-owner@example.com");
    const tokenB = await registerAndLogin("outra-usuaria@example.com");
    const boardId = await createBoard(tokenA);

    const response = await request(app)
      .post(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "A Fazer" });

    expect(response.status).toBe(403);
  });

  it("retorna 404 quando o board nao existe", async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .post("/boards/id-inexistente/lists")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "A Fazer" });

    expect(response.status).toBe(404);
  });

  it("retorna 401 sem token de autenticacao", async () => {
    const response = await request(app).post("/boards/id-qualquer/lists").send({
      title: "A Fazer",
    });

    expect(response.status).toBe(401);
  });
});

describe("GET /boards/:boardId/lists", () => {
  it("lista as listas do board ordenadas por posicao", async () => {
    const token = await registerAndLogin();
    const boardId = await createBoard(token);

    await request(app)
      .post(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "A Fazer" });
    await request(app)
      .post(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Em Progresso" });
    await request(app)
      .post(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Concluido" });

    const response = await request(app)
      .get(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.map((list: { title: string }) => list.title)).toEqual([
      "A Fazer",
      "Em Progresso",
      "Concluido",
    ]);
  });

  it("retorna 403 quando o usuario nao e membro do board", async () => {
    const tokenA = await registerAndLogin("board-owner@example.com");
    const tokenB = await registerAndLogin("outra-usuaria@example.com");
    const boardId = await createBoard(tokenA);

    const response = await request(app)
      .get(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(403);
  });

  it("retorna 401 sem token de autenticacao", async () => {
    const response = await request(app).get("/boards/id-qualquer/lists");

    expect(response.status).toBe(401);
  });
});

describe("PATCH /boards/:boardId/lists/:listId", () => {
  async function createList(token: string, boardId: string, title = "A Fazer") {
    const response = await request(app)
      .post(`/boards/${boardId}/lists`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title });

    return response.body.id as string;
  }

  it("edita o titulo da lista", async () => {
    const token = await registerAndLogin();
    const boardId = await createBoard(token);
    const listId = await createList(token, boardId);

    const response = await request(app)
      .patch(`/boards/${boardId}/lists/${listId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Novo titulo" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ title: "Novo titulo" });
  });

  it("retorna 403 quando o usuario nao e membro do board", async () => {
    const tokenA = await registerAndLogin("board-owner@example.com");
    const tokenB = await registerAndLogin("outra-usuaria@example.com");
    const boardId = await createBoard(tokenA);
    const listId = await createList(tokenA, boardId);

    const response = await request(app)
      .patch(`/boards/${boardId}/lists/${listId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "Novo titulo" });

    expect(response.status).toBe(403);
  });

  it("retorna 404 quando a lista nao existe no board", async () => {
    const token = await registerAndLogin();
    const boardId = await createBoard(token);

    const response = await request(app)
      .patch(`/boards/${boardId}/lists/id-inexistente`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Novo titulo" });

    expect(response.status).toBe(404);
  });

  it("retorna 401 sem token de autenticacao", async () => {
    const response = await request(app)
      .patch("/boards/id-qualquer/lists/id-qualquer")
      .send({ title: "x" });

    expect(response.status).toBe(401);
  });
});
