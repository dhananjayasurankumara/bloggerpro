import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    take: 5,
    select: { id: true, title: true, isPremium: true, content: true }
  });
  console.log(JSON.stringify(posts, null, 2));
}

main();
