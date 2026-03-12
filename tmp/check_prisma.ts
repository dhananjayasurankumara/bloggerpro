import prisma from '../src/lib/prisma';

async function main() {
  console.log('Available Prisma models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
}

main().catch(console.error);
