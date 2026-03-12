import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { content, topicId, parentId } = body;

    if (!content || !topicId) {
      return new NextResponse("Missing content or topicId", { status: 400 });
    }

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    const post = await prisma.forumPost.create({
      data: {
        content,
        topicId,
        authorId: userId,
        parentId: parentId || null
      }
    });

    // --- Notification Logic ---
    try {
      const topic = await prisma.forumTopic.findUnique({
        where: { id: topicId },
        select: { authorId: true, title: true }
      });

      if (topic && topic.authorId !== userId) {
        await prisma.notification.create({
          data: {
            userId: topic.authorId,
            type: "REPLY",
            content: `New reply to your topic "${topic.title.substring(0, 30)}..."`
          }
        });
      }

      if (parentId) {
        const parentPost = await prisma.forumPost.findUnique({
          where: { id: parentId },
          select: { authorId: true }
        });

        if (parentPost && parentPost.authorId !== userId && parentPost.authorId !== topic?.authorId) {
          await prisma.notification.create({
            data: {
              userId: parentPost.authorId,
              type: "REPLY",
              content: `A user replied to your forum post in "${topic?.title.substring(0, 30)}..."`
            }
          });
        }
      }
    } catch (notifError) {
      console.error("Failed to emit forum notification:", notifError);
    }
    // --- End Notification Logic ---

    // Award Points
    // +5 for a new forum post
    // +2 for a reply
    const pointsToAdd = parentId ? 2 : 5;
    
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Forum Post Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
