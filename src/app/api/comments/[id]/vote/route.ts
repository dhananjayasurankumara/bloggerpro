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

    const { type } = await request.json(); // 1 for upvote, -1 for downvote, 0 to remove
    const userId = (session.user as any).id;

    if (![1, -1, 0].includes(type)) {
      return new NextResponse("Invalid vote type", { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingVote = await tx.commentVote.findUnique({
        where: { userId_commentId: { userId, commentId } }
      });

      let voteChange = 0;
      let pointAward = 0;

      if (type === 0) {
        if (existingVote) {
          await tx.commentVote.delete({ where: { id: existingVote.id } });
          voteChange = -existingVote.type;
          if (existingVote.type === 1) pointAward = -1;
        }
      } else {
        if (existingVote) {
          if (existingVote.type === type) return { status: 'unchanged' };
          
          await tx.commentVote.update({
            where: { id: existingVote.id },
            data: { type }
          });
          voteChange = type - existingVote.type;
          if (type === 1) pointAward = 1;
          else if (existingVote.type === 1) pointAward = -1;
        } else {
          await tx.commentVote.create({
            data: { userId, commentId, type }
          });
          voteChange = type;
          if (type === 1) pointAward = 1;
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
