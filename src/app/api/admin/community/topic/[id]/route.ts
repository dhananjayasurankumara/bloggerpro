import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params; // Await the params promise here
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the topic (cascade should handle posts/likes if configured in schema, 
    // but we'll do it safely since it's SQLite)
    
    // 1. Delete associated posts and votes (Defensive guards for desynced client)
    if ((prisma as any).forumPostVote) {
      await (prisma as any).forumPostVote.deleteMany({
        where: { post: { topicId: id } }
      });
    }
    await prisma.forumPost.deleteMany({
      where: { topicId: id }
    });
    if ((prisma as any).topicVote) {
      await (prisma as any).topicVote.deleteMany({
        where: { topicId: id }
      });
    }

    // 2. Delete the topic
    await prisma.forumTopic.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Admin Topic Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 });
  }
}
