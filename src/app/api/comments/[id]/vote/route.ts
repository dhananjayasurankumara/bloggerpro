import prisma from "@/lib/prisma";
/* Production Sync: 2026-03-12 */
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

    const { type } = await request.json(); // 1 for upvote, -1 for downvote, 0 to remove
    const userId = (session.user as any).id;

    if (![1, -1, 0].includes(type)) {
      return new NextResponse("Invalid vote type", { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingVote = await (tx as any).commentLike.findUnique({
        where: { userId_commentId: { userId, commentId } }
      });

      let voteChange = 0;
      let pointAward = 0;

      if (type === 0) {
        if (existingVote) {
          await (tx as any).commentLike.delete({ where: { id: existingVote.id } });
          voteChange = -1; // Likes are only 1 or 0
          pointAward = -1;
        }
      } else {
        if (existingVote) {
          return { status: 'unchanged' };
        } else {
          await (tx as any).commentLike.create({
            data: { userId, commentId }
          });
          voteChange = 1;
          pointAward = 1;
        }
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

      return { status: 'success', currentVote: type };
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("Comment Vote Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
