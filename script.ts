import { prisma } from "./lib/prisma";

async function main() {
  // Create a new user with a post
  const transaction = await prisma.transaction.create({
    data: {
      label: "Match",
      date: new Date("2026-08-03"),
      amount: 24.64
    },
  });
  console.log("Transaction user:", transaction);

  // Fetch all users with their posts
  const allTransactions = await prisma.transaction.findMany();
  console.log("All users:", JSON.stringify(allTransactions, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });