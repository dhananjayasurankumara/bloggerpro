
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
const prisma = new PrismaClient()
async function main() {
  const posts = await prisma.post.findMany({ select: { title: true, featuredImage: true } })
  const report = posts.map(p => `Post: [${p.title}] -> Path: [${p.featuredImage}]`).join('\n')
  fs.writeFileSync('image_report.txt', report)
}
main().finally(() => prisma.$disconnect())
