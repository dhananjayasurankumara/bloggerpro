import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: commentId } = await params;

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    const result = await prisma.$transaction(async (tx) => {
      const existingLike = await tx.commentLike.findUnique({
        where: { userId_commentId: { userId, commentId } }
      });

      let voteChange = 0;
      let pointAward = 0;
      let isLiked = false;

      if (existingLike) {
        // Remove Like
        await tx.commentLike.delete({ where: { id: existingLike.id } });
        voteChange = -1;
        pointAward = -1;
        isLiked = false;
      } else {
        // Add Like
        await tx.commentLike.create({
          data: { userId, commentId }
        });
        voteChange = 1;
        pointAward = 1;
        isLiked = true;
      }

      if (voteChange !== 0) {
        await tx.comment.update({
          where: { id: commentId },
          data: { votes: { increment: voteChange } }
        });
      }

      if (pointAward !== 0) {
        await tx.user.update({
          where: { id: userId },
          data: { points: { increment: pointAward } }
        });
      }

      return { status: 'success', currentLike: isLiked };
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("Comment Like Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
