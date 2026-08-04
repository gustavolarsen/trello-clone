# Projeto Trello Clone

O sistema é uma ferramenta de gerenciamento de projetos e tarefas que usa um sistema visual baseado no método Kanban. Sua estrutura principal é formada por quadros, listas e cartões, permitindo organizar tarefas diárias em equipe.

## Funcionaldiades

### Pagina de login e cadastro com usuário e senha jwt

### Gerenciamento de Quadros (projetos)

- Criação de Quadros: Definição de título, descrição e escolha de plano de fundo (cores sólidas)
  Visibilidade: Os usuários só podem ver quadros nos quais eles são membros (ao criar se torana automaticamente um membro).
- Membros do Quadro: Sistema para convidar colaboradores informando o email de usuarios ja cadastrado

### Gerenciamento de Listas (Columns)

- CRUD de Listas: Operações de criar, ler, editar o título e arquivar/deletar listas inteiras dentro de um quadro.Reordenação: Capacidade de arrastar e soltar uma lista para mudar sua posição lateral.

### Gerenciamento de Cartões (Cards)

- Criação Rápida: Adicionar cartões informando apenas o título diretamente na lista.
- Sistema Drag and Drop: Mover cartões de forma fluida entre listas diferentes ou reordenar na mesma lista.
- Detalhes do Cartão (Modal): Ao clicar, abrir uma visão expandida contendo:
  -- Descrição: Suporte a texto formatado (Markdown).
  -- Membros: Atribuição de um ou mais usuários responsáveis por aquela tarefa.
  -- Etiquetas (Labels): Sistema de tags coloridas personalizáveis para categorização.
  -- Datas (Due Dates): Definição de prazo de entrega com status de conclusão (Atrasado, Concluído, No Prazo).
  -- Checklists: Criação de sublistas de tarefas com barra de progresso em porcentagem.Anexos:
  -- Upload de arquivos e imagens vinculados ao cartão.
  -- Comentários: Histórico de conversas entre os membros com data e hora.

## Stack:

- React
- NodeJS
- TailwindCss
- Banco SQLite

## Estrutura

```
trello-clone/
├── backend/
│   ├── src/
│   │   ├── config/               # Configurações de banco, variáveis de ambiente, etc.
│   │   ├── modules/              # Pastas divididas por recursos do sistema (Modular)
│   │   │   ├── auth/             # Rotas, controllers e serviços de login
│   │   │   ├── boards/           # Lógica dos quadros
│   │   │   ├── lists/            # Lógica das colunas
│   │   │   └── cards/            # Lógica dos cartões (e seus comentários, anexos)
│   │   │       ├── card.controller.ts
│   │   │       ├── card.service.ts
│   │   │       └── card.routes.ts
│   │   ├── middlewares/          # Validação de tokens JWT, erros globais, etc.
│   │   └── server.ts             # Inicialização do servidor Express/NestJS
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/               # Imagens estáticas, ícones e logos
│   │   ├── components/           # Componentes globais e reutilizáveis (Botões, Modais)
│   │   │   └── ui/               # Componentes visuais básicos (Shadcn/ui)
│   │   ├── features/             # Páginas organizadas por grandes blocos de regras
│   │   │   ├── auth/             # Login, Cadastro, Recuperar Senha
│   │   │   └── dashboard/        # Telas principais
│   │   │       ├── components/   # Componentes exclusivos (BoardCard, ListColumn, CardModal)
│   │   │       ├── hooks/        # Custom hooks específicos (useDragAndDrop, useSocket)
│   │   │       └── pages/        # Telas (BoardsPage.tsx, BoardDetailPage.tsx)
│   │   ├── hooks/                # Custom hooks reutilizáveis (useAuth, useFetch)
│   │   ├── services/             # Clientes de API (Axios/Fetch) e conexões Socket
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   ├── store/                # Gerenciamento de estado global (Zustand)
│   │   └── main.tsx              # Ponto de entrada do React
│   └── package.json
```
