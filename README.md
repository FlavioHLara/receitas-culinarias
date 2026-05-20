
# Desafio técnico

Aplicação para gerenciamento de receitas culinárias.
Backend em Node.js/TypeScript expondo uma API REST consumida por um frontend em Vue.

> Status: backend está em pé, com a rota de health

## Stack

- **Backend:** Node.js 22 + TypeScript + Express
- **Banco:** MySQL 8
- **Frontend:** Vue 3 
- **Infra:** Docker / docker-compose

## O que  precisa instalar

- Node.js 22.x ([download](https://nodejs.org))
- Docker Desktop ([download](https://www.docker.com/products/docker-desktop/))
- Git

Se quiser rodar o MySQL fora do Docker, precisa ter o MySQL 8 instalado localmente.

## Como rodar

### 1. Clonar o repositório

```bash
git clone <url-do-repo>
cd receitas-culinarias
```

### 2. Subir o banco

Na raiz do projeto:

```bash
docker compose up -d mysql
```

O `docker-compose.yml` já aponta para o `script.sql` que está em `desafio/banco/`, então na primeira vez que o container subir o banco vai ser criado e as categorias populadas automaticamente.

Para acompanhar o log até ver "ready for connections":

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

## Scripts backend

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor em modo dev com watch (tsx) |
| `npm run build` | Compila o TypeScript pra `dist/` |
| `npm start` | Roda o build de produção |