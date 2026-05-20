# Desafio técnico

Aplicação para gerenciamento de receitas culinárias.
Backend em Node.js/TypeScript expondo uma API REST consumida por um frontend em Vue.

> Status: backend está em pé, com a rota de health.

## Stack

- **Backend:** Node.js 22 + TypeScript + Express
- **Banco:** MySQL 8
- **Frontend:** Vue 3
- **Infra:** Docker / docker-compose

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

### 1. Clonar o repositório

```bash
git clone <https://github.com/FlavioHLara/receitas-culinarias.git>
cd receitas-culinarias
```

### 2. Subir o banco

Na raiz do projeto:

```bash
docker compose up -d mysql
```

O `docker-compose.yml` monta a pasta `docker/` como volume de inicialização do MySQL. Na primeira vez que o container subir, o `init.sql` é executado automaticamente — cria o schema, as tabelas (`usuarios`, `categorias`, `receitas`) e popula as 13 categorias padrão.

Pra acompanhar até ver "ready for connections":

```bash
docker compose logs -f mysql
```

### 3. Configurar o backend

```bash
cd backend
npm install
cp .env.example .env
```

Abre o `.env` e ajusta se precisar. Os valores default já batem com o que o docker-compose sobe (user `root`, senha `root`, porta `3306`). Trocar o `JWT_SECRET` por algo de verdade.

### 4. Rodar o backend

Ainda dentro de `backend/`:

```bash
npm run dev
```

Se tudo deu certo, vai aparecer no console:

```
Banco de dados conectado
Servidor rodando na porta 3333
```

Abrir `http://localhost:3333/health` no navegador (ou no Postman/Insomnia). Tem que retornar:

```json
{ "status": "ok" }
```

## Estrutura do projeto

```
receitas-culinarias/
├── backend/              # API REST (Node + TS + Express)
│   ├── src/
│   │   ├── config/       # conexão com o banco
│   │   ├── controllers/  # handlers das rotas
│   │   ├── repositories/ # acesso ao banco (SQL)
│   │   ├── services/     # regras de negócio
│   │   ├── middlewares/  # auth, tratamento de erro
│   │   ├── routes/       # definição das rotas
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── docker/
│   └── init.sql          # schema + seed de categorias
└── docker-compose.yml
```

## Scripts backend

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor em modo dev com watch (tsx) |
| `npm run build` | Compila o TypeScript pra `dist/` |
| `npm start` | Roda o build de produção |

## Parando o ambiente

Pra desligar o MySQL mantendo os dados:

```bash
docker compose stop
```

Pra apagar tudo (container + volume com os dados):

```bash
docker compose down -v
```
