import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (authErr: any) {
      console.error("[HEALTH_ERROR] Auth check failed:", authErr.message);
    }

    let db_connection = false;
    let db_error = null;
    try {
      const result = await prisma.$queryRaw`SELECT 1 as connected`;
      db_connection = !!result;
    } catch (e: any) {
      db_connection = false;
      db_error = e.message;
    }

    const health = {
      status: "DIAGNOSTIC_MODE",
      DATABASE_URL_PRESENT: !!process.env.DATABASE_URL,
      DATABASE_REACHABLE: db_connection,
      DATABASE_ERROR: db_error,
      NEXTAUTH_SECRET_PRESENT: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      VERCEL: !!process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
      authenticated: !!session,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(health);
  } catch (criticalErr: any) {
    return NextResponse.json({
      status: "CRITICAL_FAILURE",
      error: criticalErr.message,
      env_keys: Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("NEXTAUTH"))
    }, { status: 200 }); // Return 200 even on error so we can see the JSON
  }
}
