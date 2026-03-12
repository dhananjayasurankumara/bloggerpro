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
    const { id: postId } = await params;

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content } = await request.json();
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    const post = await prisma.forumPost.findUnique({
      where: { id: postId }
    });

    if (!post) return new NextResponse("Not Found", { status: 404 });

    // Only author or admin can edit
    if (post.authorId !== userId && userRole !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedPost = await prisma.forumPost.update({
      where: { id: postId },
      data: {
        content: content || post.content,
        isEdited: true
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Post Edit Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: postId } = await params;

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    const post = await prisma.forumPost.findUnique({
      where: { id: postId }
    });

    if (!post) return new NextResponse("Not Found", { status: 404 });

    // Only author or admin can delete
    if (post.authorId !== userId && userRole !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.$transaction([
        prisma.forumPostVote.deleteMany({ where: { postId } }),
        prisma.forumPost.delete({ where: { id: postId } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post Delete Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
