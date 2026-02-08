# Prisma + Postgres API (Local)

Small Node.js API using **Prisma** and **Postgres** (via Docker). Provides basic
persistence and querying for a single model.

---

## Requirements

- Node.js **18+**
- npm
- **Docker + Docker Compose**

---

## Install Docker

### macOS

1. Download **Docker Desktop**:
   [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Install and launch Docker Desktop
3. Verify installation:

### Brew

Install command: brew install docker

To test to make sure docker is installed, open your terminal and enter the
following commands:

```
docker --version
docker compose version
```

---

## Start Docker (Required)

Docker must be **running** before any database commands will work.

### macOS — Docker Desktop (recommended)

1. Press **⌘ + Space** to open Spotlight
2. Search for **Docker**
3. Open **Docker Desktop**
4. Wait until Docker shows **“Docker is running”** (whale icon in the menu bar)

Verify:

```bash
docker info
```

---

### macOS — Homebrew (CLI)

If you installed Docker via Homebrew:

```bash
brew install --cask docker
open /Applications/Docker.app
```

Wait for Docker to finish starting, then verify:

```bash
docker info
```

---

### If Docker is not running

You may see errors like:

- `Cannot connect to the Docker daemon`
- `error during connect`

---

## Setup

### 1. Start Postgres

Start Docker using the steps above, then enter the command below in your
terminal.

```bash
docker compose up -d
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Initialize Prisma

```bash
npx prisma init
```

This will:

- Create the database tables
- Generate the Prisma client

---

### 4. Create Prisma Schema

Your goal is to create your **own** Prisma model that matches the fields needed
for this API.

You’re storing simple “items” with:

- `id` (auto-increment primary key)
- `name` (short text)
- `description` (long text)
- `createdAt` (timestamp)

#### Example JSON that should fit your schema

This is the shape your `POST /items` endpoint will accept:

```json
{
  "name": "Sample Item",
  "description": "This is a longer description that should be stored in the database."
}
```

#### What you need to do

1. Open:

```
prisma/schema.prisma
```

2. Define a Prisma model (recommended name: `Item`) that supports the example
   JSON plus the required fields above.

3. Copy the example env contents into .env (.env in the root that Prisma Init
   generated)

```env
DATABASE_URL="postgresql://app:app@localhost:5432/appdb?schema=public"
PORT=3000
```

4. Run a migration:

```bash
npx prisma migrate dev --name init
```

5. Generate the Prisma client:

```bash
npx prisma generate
```

---

### ✅ Working Example (use only if you get stuck)

If you’re stuck, compare your schema with this working version:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Item {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  description String   @db.Text
  createdAt   DateTime @default(now())
}
```

---

### Troubleshooting

#### Prisma folder / schema missing

If you don’t have a `prisma/` folder yet:

```bash
npx prisma init
```

#### `P1012` or schema validation errors

- Make sure you are using Prisma v5 (this project expects v5).
- Check your `schema.prisma` includes both `datasource` and `generator`.
- Ensure your model field types are valid Prisma types (`String`, `Int`,
  `DateTime`).

#### `Environment variables loaded from .env` but DB won’t connect

Check `.env` has a valid `DATABASE_URL` (no extra quotes recommended on
Windows):

```env
DATABASE_URL=postgresql://app:app@localhost:5432/appdb?schema=public
```

Also ensure Postgres is running:

```bash
docker ps
```

#### `Port 5432 already in use`

You already have Postgres running locally. Either:

- stop the other Postgres service, or
- change the docker port mapping in `docker-compose.yml`

Example:

```yml
ports:
  - "5433:5432"
```

Then update `.env` to `localhost:5433`.

#### Migration ran but table doesn’t exist

Try running:

```bash
npx prisma migrate dev
npx prisma studio
```

If the table still isn’t present, your migration likely failed—scroll up for the
real error message.

#### Prisma seems “broken” / weird CLI errors

Hard reset dependencies:

```bash
rm -rf node_modules
rm package-lock.json
npm install
npx prisma generate
```

---

### 6. Seed Database

Run the seed script in terminal

```bash
npx prisma db seed
```

---

### 7. Verify Database Was Seeded

Start Prisma Studio, and check to make sure the seeded data appears in the
database

```bash
npx prisma studio
```

---

### 8. Start the server

```bash
node server.js
```

Server will be available at:

```
http://localhost:3000
```

---

## Data Model

### Item

| Field       | Type     | Notes                       |
| ----------- | -------- | --------------------------- |
| id          | Int      | Auto-increment, primary key |
| name        | String   | Short text                  |
| description | String   | Long text                   |
| createdAt   | DateTime | Defaults to now             |

---

## API Usage (JavaScript `fetch`)

### Get all items

```js
const res = await fetch("http://localhost:3000/items");
const items = await res.json();

console.log(items);
```

---

### Create an item

```js
const res = await fetch("http://localhost:3000/items", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Example item",
    description: "This is a longer description.",
  }),
});

const created = await res.json();
console.log(created);
```

---

## Prisma

### Schema location

```
prisma/schema.prisma
```

### Common commands

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

---

## Notes

- Uses **JavaScript** (no TypeScript)
- Requires **Node 18+** for built-in `fetch`
- Database connection is controlled via `DATABASE_URL`
- Switching to **NeonDB** only requires changing `DATABASE_URL`
- API-only (no frontend)

---

## Troubleshooting

### Docker command not found

- Docker Desktop not installed or not running
- Restart your terminal after installation

### Port 5432 already in use

- Stop local Postgres, or
- Change the exposed port in `docker-compose.yml`

### Database connection fails

- Ensure Docker is running
- Ensure `.env` exists
- Wait a few seconds after `docker compose up`

### `fetch` is not defined

- Ensure Node 18+
- Or upgrade Node: `node -v`

---

Here’s a **clean, copy-pasteable Cleanup section** you can drop straight into
the README. It explains **exactly** how to stop Postgres and **fully remove the
database instance**.

---

## Cleanup (Stop & Remove Database)

Use this section if you want to completely reset the local database or start
fresh.

### Stop the database container

```bash
docker compose down
```

This stops the Postgres container but **keeps the database data**.

---

### Remove the database **and all data**

⚠️ This will permanently delete all local database data.

```bash
docker compose down -v
```

This removes:

- The Postgres container
- The Docker volume holding database data

---

### Verify cleanup

```bash
docker ps
docker volume ls
```

You should **not** see:

- the Postgres container
- the database volume (e.g. `task_3_pgdata`)

---

### Start fresh after cleanup

```bash
docker compose up -d
npx prisma migrate dev
npx prisma db seed
```

---

### Common cleanup issues

**Container name already in use**

```bash
docker rm -f local_postgres
```

**Volume still exists**

```bash
docker volume rm task_3_pgdata
```

---

### Why this exists

Docker volumes persist data by default. This section ensures you can:

- recover from broken migrations
- fix credential mismatches
- reset the environment during development
