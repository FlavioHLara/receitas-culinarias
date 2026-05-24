# Desafio técnico

Aplicação para gerenciamento de receitas culinárias.
Backend em Node.js/TypeScript expondo uma API REST consumida por um frontend em Vue.

## Stack

- **Backend:** Node.js 22 + TypeScript + Express
- **Banco:** MySQL 8
- **Frontend:** Vue 2.7 + TypeScript + Pinia + Vue Router
- **Infra:** Docker / docker-compose
- **Testes:** Jest + Supertest
- **Documentação da API:** Swagger (OpenAPI 3.0)

## Pré-requisitos

- Node.js 22.x ([download](https://nodejs.org))
- Docker + Docker Compose
- Git

### Instalando o Docker

**Windows / Mac:** Docker Desktop ([download](https://www.docker.com/products/docker-desktop/))

**Linux (Ubuntu/Debian):**

```bash
# Instalar o Docker Engine
curl -fsSL https://get.docker.com | sh

# Adicionar o seu usuário ao grupo docker (pra não precisar de sudo)
sudo usermod -aG docker $USER
newgrp docker

# Confere
docker --version
docker compose version
```

Em outras distros os passos mudam um pouco — a [documentação oficial](https://docs.docker.com/engine/install/) cobre Fedora, Arch, etc.

Se preferir não usar Docker, é só ter o MySQL 8 instalado localmente e rodar o `docker/init.sql` à mão.

## Como rodar

### Opção A — Tudo via Docker 

Sobe MySQL + backend + frontend com um único comando. Na raiz do projeto:

```bash
git clone https://github.com/FlavioHLara/receitas-culinarias.git
cd receitas-culinarias
docker compose up --build
```

A primeira execução demora uns 3-5 minutos (baixa imagens, instala deps, compila TS e Vue). Quando terminar de subir tudo:

| | URL |
|---|---|
| Frontend (aplicação) | http://localhost:8080 |
| API | http://localhost:3333 |
| Swagger | http://localhost:3333/docs |
| MySQL | localhost:3306 |

Pra rodar em segundo plano: `docker compose up -d --build`.

### Opção B — Manual (apenas o banco via Docker)

Útil pra desenvolvimento local com hot-reload no backend e no frontend.

**1. Subir o banco**

```bash
docker compose up -d mysql
```

O `docker-compose.yml` monta a pasta `docker/` como volume de inicialização do MySQL. Na primeira vez que o container subir, o `init.sql` é executado automaticamente — cria o schema, as tabelas (`usuarios`, `categorias`, `receitas`) e popula as 13 categorias padrão.

Pra acompanhar até ver "ready for connections":

```bash
docker compose logs -f mysql
```

**2. Configurar e rodar o backend**

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Abre o `.env` e ajusta se precisar. Os valores default já batem com o que o docker-compose sobe (user `root`, senha `root`, porta `3306`). Trocar o `JWT_SECRET` por algo de verdade.

Se tudo deu certo, vai aparecer no console:

```
Banco de dados conectado
Servidor rodando na porta 3333
```

Abrir `http://localhost:3333/health` retorna `{ "status": "ok" }`.

A documentação da API está em `http://localhost:3333/docs`.

**3. Rodar o frontend**

Em outro terminal:

```bash
cd frontend
npm install --legacy-peer-deps
npm run serve
```

Acessa `http://localhost:8080`.

> O `--legacy-peer-deps` é necessário por causa da versão fixada do Pinia compatível com Vue 2.7.

## Testes

Os testes do backend ficam em `backend/src/tests/` divididos em `unit/` e `e2e/`. Pra rodar os E2E o MySQL precisa estar de pé.

```bash
cd backend
npm test           # só unitários
npm run test:e2e   # só E2E
npm run test:all   # tudo
```

## Documentação da API

Com o backend rodando, acessa `http://localhost:3333/docs`. A interface Swagger permite explorar todas as rotas e testar direto pelo navegador. A spec OpenAPI completa fica em `backend/src/docs/swagger.yaml`.

**Como autenticar no Swagger:**
1. Chama `POST /auth/cria-usuario` (ou `POST /auth/login` se já tiver conta)
2. Copia o `token` do response
3. Clica no botão **Authorize** no canto superior direito e cola o token
4. Todas as rotas protegidas passam a funcionar direto da interface

## Estrutura do projeto

```
receitas-culinarias/
├── backend/              # API REST (Node + TS + Express)
│   ├── src/
│   │   ├── config/       # conexão com o banco, swagger
│   │   ├── constants/    # mensagens em enum
│   │   ├── controllers/  # handlers das rotas
│   │   ├── docs/         # swagger.yaml
│   │   ├── errors/       # AppError
│   │   ├── middlewares/  # auth, tratamento de erro
│   │   ├── repositories/ # acesso ao banco (SQL)
│   │   ├── routes/       # definição das rotas
│   │   ├── schemas/      # validação com Zod
│   │   ├── services/     # regras de negócio
│   │   ├── tests/        # unit + e2e
│   │   ├── types/        # interfaces TypeScript
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # SPA (Vue 2 + TS + Pinia)
│   ├── src/
│   │   ├── assets/       # app.css com variáveis globais
│   │   ├── components/   # Navbar
│   │   ├── router/       # rotas + guard de autenticação
│   │   ├── services/     # axios + chamadas à API
│   │   ├── stores/       # Pinia (auth)
│   │   ├── types/        # interfaces compartilhadas
│   │   ├── views/        # Login, Cadastro, Receitas, ReceitaForm, ReceitaDetalhe
│   │   ├── App.vue
│   │   └── main.ts
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tsconfig.json
├── docker/
│   └── init.sql          # schema + seed de categorias
└── docker-compose.yml
```

## Scripts

**Backend** (`cd backend`)

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor em modo dev com watch (tsx) |
| `npm run build` | Compila o TypeScript pra `dist/` |
| `npm start` | Roda o build de produção |
| `npm test` | Testes unitários |
| `npm run test:e2e` | Testes de integração |
| `npm run test:all` | Roda todos os testes |

**Frontend** (`cd frontend`)

| Comando | O que faz |
|---|---|
| `npm run serve` | Sobe o dev server com hot-reload |
| `npm run build` | Gera build de produção em `dist/` |
| `npm run lint` | Verifica problemas de lint |

## Parando o ambiente

Pra desligar o MySQL mantendo os dados:

```bash
docker compose stop
```

Pra apagar tudo (container + volume com os dados):

```bash
docker compose down -v
```
