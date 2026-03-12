import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: topicId } = await params;

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content, category } = await request.json();
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId }
    });

    if (!topic) return new NextResponse("Not Found", { status: 404 });

    // Only author or admin can edit
    if (topic.authorId !== userId && userRole !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedTopic = await prisma.forumTopic.update({
      where: { id: topicId },
      data: {
        title: title || topic.title,
        content: content || topic.content,
        category: category || topic.category,
        isEdited: true
      }
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Topic Edit Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: topicId } = await params;

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    const topic = await prisma.forumTopic.findUnique({
      where: { id: topicId }
    });

    if (!topic) return new NextResponse("Not Found", { status: 404 });

    // Only author or admin can delete
    if (topic.authorId !== userId && userRole !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Use transaction to clean up relationships if needed (Cascade usually handles but let's be safe)
    await prisma.$transaction([
        prisma.topicVote.deleteMany({ where: { topicId } }),
        prisma.forumPost.deleteMany({ where: { topicId } }),
        prisma.forumTopic.delete({ where: { id: topicId } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Topic Delete Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
