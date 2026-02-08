require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

/**
 * GET /items
 * Optional query params:
 *  - sort=asc|desc   (default: desc)
 *  - odd=true        (if "true", only return items with odd ids)
 */
app.get("/items", async (req, res) => {
  try {
    const sort = (req.query.sort || "desc").toLowerCase();
    const odd = String(req.query.odd || "false").toLowerCase() === "true";

    const orderBy =
      sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" };

    // Prisma doesn't have a native "odd" filter, so we filter in JS.
    const items = await prisma.item.findMany({ orderBy });

    const filtered = odd ? items.filter((i) => i.id % 2 === 1) : items;

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/**
 * GET /items/:id
 */
app.get("/items/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "id must be a positive integer" });
    }

    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      return res.status(404).json({ error: `Item ${id} not found` });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/**
 * POST /items
 * Body: { name: string, description: string }
 */
app.post("/items", async (req, res) => {
  try {
    const { name, description } = req.body || {};

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "name is required (string)" });
    }
    if (typeof description !== "string" || description.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "description is required (string)" });
    }

    if (name.length > 255) {
      return res.status(400).json({ error: "name must be <= 255 characters" });
    }

    const created = await prisma.item.create({
      data: {
        name: name.trim(),
        description: description.trim(),
      },
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
