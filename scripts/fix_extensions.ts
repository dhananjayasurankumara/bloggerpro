
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function main() {
  console.log("🚀 Starting Image Extension Repair...");
  
  const posts = await prisma.post.findMany({
    where: {
      featuredImage: {
        not: null
      }
    }
  });

  for (const post of posts) {
    const imageUrl = post.featuredImage;
    if (!imageUrl) continue;

    // Check if it has an extension
    const ext = path.extname(imageUrl);
    if (!ext) {
      console.log(`📦 Repairing post: [${post.title}]`);
      const newUrl = `${imageUrl}.jpg`;
      const oldFilename = path.basename(imageUrl);
      const newFilename = `${oldFilename}.jpg`;
      
      const oldPath = path.join(uploadsDir, oldFilename);
      const newPath = path.join(uploadsDir, newFilename);

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`   ✅ Renamed file: ${oldFilename} -> ${newFilename}`);
      } else {
        console.warn(`   ⚠️ File not found on disk: ${oldFilename}`);
      }

      await prisma.post.update({
        where: { id: post.id },
        data: { featuredImage: newUrl }
      });
      console.log(`   ✅ Updated database record.`);
    }
  }

  console.log("🏁 Repair Complete!");
}

main()
  .catch(e => console.error("❌ Repair Failed:", e))
  .finally(() => prisma.$disconnect());
