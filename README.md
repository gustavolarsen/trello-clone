# Trello Clone

Clone do Trello com quadros, listas e cartões (Kanban). Veja [`SPEC.md`](./SPEC.md) para a especificação completa do projeto e o plano de desenvolvimento em TDD.

## Backend

Stack: Node.js + Express + TypeScript, Prisma + SQLite, Vitest + Supertest, Zod.

### Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
```

### Scripts

```bash
npm run dev         # inicia o servidor em modo watch
npm run build        # compila o TypeScript para dist/
npm start            # roda a versao compilada
npm run test         # roda os testes uma vez (Vitest)
npm run test:watch   # roda os testes em modo watch
npm run lint          # checa lint (ESLint)
npm run format        # formata o codigo (Prettier)
```

O servidor sobe em `http://localhost:3000` por padrão (configurável via `PORT` no `.env`). Rota de verificação: `GET /health`.
