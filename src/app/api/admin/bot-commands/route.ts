import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commands = await prisma.botCommand.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(commands);
  } catch (error) {
    console.error("Bot Commands Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch commands" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { command, response } = await request.json();

    if (!command || !response) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newCommand = await prisma.botCommand.create({
      data: {
        command: command.toLowerCase().trim(),
        response: response.trim()
      }
    });

    return NextResponse.json(newCommand);
  } catch (error: any) {
    console.error("Bot Command Create Error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Command already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.botCommand.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Command Delete Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
