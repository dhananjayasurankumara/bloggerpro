
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ALIVE",
    message: "Zero-dependency environment check",
    database_url_defined: !!process.env.DATABASE_URL,
    nextauth_secret_defined: !!process.env.NEXTAUTH_SECRET,
    nextauth_url: process.env.NEXTAUTH_URL || "NOT SET",
    vercel: !!process.env.VERCEL,
    vercel_env: process.env.VERCEL_ENV || "NOT SET",
    node_version: process.version,
    timestamp: new Date().toISOString(),
    available_envs: Object.keys(process.env).filter(k => 
      k.includes("DATABASE") || 
      k.includes("AUTH") || 
      k.includes("VERCEL") ||
      k.includes("NEON")
    )
  });
}
