require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

// TODO: initialize Prisma client here
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

app.get("/items", async (req, res) => {
  try {
    // TODO: return all items
    // const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/items", async (req, res) => {
  try {
    const { name, description } = req.body;

    // TODO: validate name/description
    // TODO: create item via Prisma
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
