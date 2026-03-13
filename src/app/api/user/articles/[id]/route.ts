import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Fetch article for editing (Author only)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (post.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("USER_POST_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// Update article (Author only)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { title, slug, content, excerpt, featuredImage, categoryId } = body;

    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (existingPost.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Defensive Logic: If post was published, reset to pending for re-review
    const status = existingPost.status === "PUBLISHED" ? "PENDING" : existingPost.status;
    const published = status === "PUBLISHED";

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        categoryId,
        status,
        published
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("USER_POST_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// Delete article (Author only)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (post.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("USER_POST_DELETE_ERROR", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
