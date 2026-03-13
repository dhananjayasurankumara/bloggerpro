import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Robust fallback using raw query to bypass potential Prisma client sync issues on Windows
    const tips: any = await prisma.$queryRaw`SELECT * FROM "DailyTip" WHERE "active" = 1 ORDER BY "createdAt" DESC LIMIT 1`;
    const tip = tips && tips.length > 0 ? tips[0] : null;

    return NextResponse.json(tip || { content: "Stay focused and keep building your wealth one step at a time." });
  } catch (error) {
    console.error("Fetch Tip Error:", error);
    // Even if raw query fails, return the fallback to prevent console errors on frontend
    return NextResponse.json({ content: "Stay focused and keep building your wealth one step at a time." });
  }
}
