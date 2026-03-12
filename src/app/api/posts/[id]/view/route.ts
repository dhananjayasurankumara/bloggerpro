import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ viewCount: post?.viewCount || 0 });
  } catch (error) {
    console.error("View Refresh Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
