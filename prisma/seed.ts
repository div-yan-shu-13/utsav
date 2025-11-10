import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const managerClerkId = "user_34yvv94kRhasnH2PAhPcdUGC48x";

  const clubsToCreate = [
    {
      name: "IEEE Computer Society",
      description:
        "The official tech club of MUJ, focusing on computing and technology.",
    },
    {
      name: "Coreogrfia",
      description:
        "The official dance club of MUJ, celebrating all forms of movement.",
    },
    {
      name: "Cinefilia",
      description: "The official dramatics, theatre, and film club of MUJ.",
    },
    {
      name: "Litmus",
      description: "The official literary, debating, and MUN club of MUJ.",
    },
  ];

  console.log("Starting to seed clubs...");

  for (const club of clubsToCreate) {
    const newClub = await db.club.upsert({
      where: { name: club.name },
      update: {},
      create: {
        name: club.name,
        description: club.description,
        manager: {
          connect: {
            clerkId: managerClerkId,
          },
        },
      },
    });
    console.log(`Created or found club: ${newClub.name}`);
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
