import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const updates = await prisma.whatsNew.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(updates);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, type, image } = await request.json();

    if (!title || !content || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const update = await prisma.whatsNew.create({
      data: {
        title,
        content,
        type,
        image
      }
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error("WhatsNew Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
     const { searchParams } = new URL(request.url);
     const id = searchParams.get("id");
     
     if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

     await prisma.whatsNew.delete({
       where: { id }
     });

     return NextResponse.json({ success: true });
  } catch (error) {
     return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
