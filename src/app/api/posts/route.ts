import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN" && userRole !== "MODERATOR") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, isPremium, published, readTime, featuredImage } = body;

    if (!title || !content) {
      return new NextResponse("Missing title or content", { status: 400 });
    }

    // Default category if none provided - Wealth Building
    const defaultCategory = await prisma.category.findFirst({ where: { slug: "wealth-building" } });

    const post = await prisma.post.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        excerpt,
        content,
        isPremium,
        published,
        readTime: readTime || "10 min read",
        featuredImage,
        authorId: (session.user as any).id,
        categoryId: defaultCategory?.id || "",
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
