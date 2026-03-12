import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { content, postId, parentId, isAnonymous } = body;

    if (!content || !postId) {
      return new NextResponse("Missing content or postId", { status: 400 });
    }

    // if not logged in, they can only post if anonymous? 
    // Usually, we want logged in users to have the option to be anonymous.
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
        parentId,
        isAnonymous: !!isAnonymous
      }
    });

    // --- Notification Logic ---
    try {
      // 1. Notify Post Author
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, title: true }
      });

      if (post && post.authorId !== userId) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: "COMMENT",
            content: `New comment on your post "${post.title.substring(0, 30)}..."`
          }
        });
      }

      // 2. Notify Parent Comment Author (if reply)
      if (parentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentId },
          select: { userId: true }
        });

        if (parentComment && parentComment.userId !== userId && parentComment.userId !== post?.authorId) {
          await prisma.notification.create({
            data: {
              userId: parentComment.userId,
              type: "REPLY",
              content: `A user replied to your comment on "${post?.title.substring(0, 30)}..."`
            }
          });
        }
      }
    } catch (notifError) {
      console.error("Failed to emit notification:", notifError);
    }
    // --- End Notification Logic ---

    // Award Points
    // +5 for a new comment
    // +2 for a reply (parentId exists)
    const pointsToAdd = parentId ? 2 : 5;
    
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return new NextResponse("Missing postId", { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const includes: any = {
      user: { select: { name: true, image: true, points: true } },
      replies: {
          include: { 
            user: { select: { name: true, image: true, points: true } },
          }
      }
    };

    if (userId) {
      if ((prisma.comment as any).fields?.commentLikes) {
          includes.commentLikes = { where: { userId } };
          includes.replies.include.commentLikes = { where: { userId } };
      }
    }

    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null }, // Fetch top-level first
      include: includes,
      orderBy: { createdAt: "desc" }
    });

    const formattedComments = comments.map(comment => ({
      ...comment,
      userLiked: userId ? (!!(comment as any).commentLikes?.[0]) : false,
      replies: ((comment as any).replies || []).map((reply: any) => ({
        ...reply,
        userLiked: userId ? (!!(reply as any).commentLikes?.[0]) : false
      }))
    }));

    return NextResponse.json(formattedComments || []);
  } catch (error) {
    console.error("Fetch Comments Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
