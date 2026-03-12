import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "READY",
    message: "Zero-dependency diagnostic success.",
    timestamp: new Date().toISOString(),
    env_summary: {
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      VERCEL_ENV: process.env.VERCEL_ENV || "NOT SET"
    }
  });
}
