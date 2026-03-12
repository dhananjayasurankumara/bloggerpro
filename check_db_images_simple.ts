
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const posts = await prisma.post.findMany({ select: { featuredImage: true } })
  posts.forEach(p => console.log(`IMAGE_PATH: [${p.featuredImage}]`))
}
main().finally(() => prisma.$disconnect())
