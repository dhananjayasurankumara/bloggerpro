import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user && (session.user as any).role === "ADMIN";
}

export async function GET() {
  if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Use raw query for list to avoid client sync issues
    const tips = await prisma.$queryRaw`SELECT * FROM "DailyTip" ORDER BY "createdAt" DESC`;
    return NextResponse.json(tips);
  } catch (error) {
    console.error("Admin Fetch Tips Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await request.json();
    const { id, content, active } = body;

    if (id) {
      const tip = await prisma.dailyTip.update({
        where: { id },
        data: { content, active }
      });
      return NextResponse.json(tip);
    } else {
      const tip = await prisma.dailyTip.create({
        data: { content, active: active ?? true }
      });
      return NextResponse.json(tip);
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return new NextResponse("Missing id", { status: 400 });

    await prisma.dailyTip.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
