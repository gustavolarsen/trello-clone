import bcrypt from "bcrypt";
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

  it("salva a senha com hash, nunca em texto puro", async () => {
    await request(app).post("/auth/register").send({
      name: "Maria Silva",
      email: "maria@example.com",
      password: "senha123",
    });

    const userInDb = await prisma.user.findUniqueOrThrow({
      where: { email: "maria@example.com" },
    });

    expect(userInDb.password).not.toBe("senha123");
    expect(await bcrypt.compare("senha123", userInDb.password)).toBe(true);
  });

  it("retorna 400 quando o email e invalido", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Maria Silva",
      email: "nao-e-um-email",
      password: "senha123",
    });

    expect(response.status).toBe(400);
  });

  it("retorna 400 quando a senha e muito curta", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Maria Silva",
      email: "maria@example.com",
      password: "123",
    });

    expect(response.status).toBe(400);
  });

  it("retorna 400 quando o nome esta ausente", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "maria@example.com",
      password: "senha123",
    });

    expect(response.status).toBe(400);
  });

  it("retorna 400 quando o email ja esta cadastrado", async () => {
    await request(app).post("/auth/register").send({
      name: "Maria Silva",
      email: "maria@example.com",
      password: "senha123",
    });

    const response = await request(app).post("/auth/register").send({
      name: "Outra Maria",
      email: "maria@example.com",
      password: "outrasenha",
    });

    expect(response.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("retorna um token jwt para credenciais validas", async () => {
    await request(app).post("/auth/register").send({
      name: "Maria Silva",
      email: "maria@example.com",
      password: "senha123",
    });

    const response = await request(app).post("/auth/login").send({
      email: "maria@example.com",
      password: "senha123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTypeOf("string");
  });

  it("retorna 401 quando a senha esta incorreta", async () => {
    await request(app).post("/auth/register").send({
      name: "Maria Silva",
      email: "maria@example.com",
      password: "senha123",
    });

    const response = await request(app).post("/auth/login").send({
      email: "maria@example.com",
      password: "senhaerrada",
    });

    expect(response.status).toBe(401);
  });

  it("retorna 401 quando o email nao esta cadastrado", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "naoexiste@example.com",
      password: "senha123",
    });

    expect(response.status).toBe(401);
  });
});
