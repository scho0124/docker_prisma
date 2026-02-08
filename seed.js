const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.item.createMany({
    data: [
      {
        name: "Welcome Item",
        description: "Initial seeded item for local development.",
      },
      {
        name: "Sample Entry",
        description: "This is a longer description used for testing.",
      },
      {
        name: "Another Item",
        description: "Helps verify GET and POST endpoints.",
      },
    ],
    skipDuplicates: true,
  });

  console.log("🌱 Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
