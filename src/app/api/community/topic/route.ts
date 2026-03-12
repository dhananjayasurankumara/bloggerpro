import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    const body = await request.json();
    const { title, category, content, isPremiumOnly } = body;

    if (!title || !category || !content) {
      return NextResponse.json({ error: "Title, category, and content are required" }, { status: 400 });
    }

    console.log("Creating topic for user:", userId);

    // Verify user exists in the DB (prevents foreign key errors after DB reset)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ 
        error: "User account no longer exists. Please sign out and sign in again.",
        details: "FOREIGN_KEY_USER_NOT_FOUND"
      }, { status: 401 });
    }

    const topic = await prisma.forumTopic.create({
      data: {
        title,
        category,
        content,
        isPremiumOnly: !!isPremiumOnly,
        authorId: userId,
        viewCount: 0,
      }
    });

    // Award Points for starting a discussion - use defensive update
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: 10 } }
      });
    } catch (pointsError) {
      console.warn("Failed to award points, but topic was created:", pointsError);
    }

    return NextResponse.json(topic);
  } catch (error: any) {
    console.error("Topic Creation Error:", error);
    // Return more helpful message in dev if possible
    const errorMessage = error.message || "Internal Error";
    return NextResponse.json({ 
      error: "Failed to create discussion board", 
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
    }, { status: 500 });
  }
}
