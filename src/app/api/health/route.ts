import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  let db_connection = false;
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    db_connection = !!result;
  } catch (e) {
    db_connection = false;
  }

  // Basic check for env presence (sanitized)
  const health = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DATABASE_REACHABLE: db_connection,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    AUTH_TRUST_HOST: !!process.env.AUTH_TRUST_HOST,
    NODE_ENV: process.env.NODE_ENV,
    authenticated: !!session,
  };

  return NextResponse.json(health);
}
