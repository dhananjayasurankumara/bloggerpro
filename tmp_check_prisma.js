import prisma from './src/lib/prisma.js';

async function main() {
  console.log('Available Prisma Models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
}

main().catch(console.error);
