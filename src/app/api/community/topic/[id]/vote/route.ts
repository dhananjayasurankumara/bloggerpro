import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: topicId } = await params;

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type } = await request.json(); // 1 for upvote, -1 for downvote, 0 to remove
    const userId = (session.user as any).id;

    if (![1, -1, 0].includes(type)) {
      return new NextResponse("Invalid vote type", { status: 400 });
    }

    // 1. Transaction to handle vote and count update
    const result = await prisma.$transaction(async (tx) => {
      // Find existing vote
      const existingVote = await tx.topicVote.findUnique({
        where: { userId_topicId: { userId, topicId } }
      });

      let voteChange = 0;

      if (type === 0) {
        // Remove vote
        if (existingVote) {
          await tx.topicVote.delete({ where: { id: existingVote.id } });
          voteChange = -existingVote.type;
        }
      } else {
        // Upsert vote
        if (existingVote) {
          if (existingVote.type === type) return { status: 'unchanged' }; // Already voted this way
          
          await tx.topicVote.update({
            where: { id: existingVote.id },
            data: { type }
          });
          voteChange = type - existingVote.type;
        } else {
          await tx.topicVote.create({
            data: { userId, topicId, type }
          });
          voteChange = type;
        }
      }

      // Update topic vote count
      if (voteChange !== 0) {
        await tx.forumTopic.update({
          where: { id: topicId },
          data: { votes: { increment: voteChange } }
        });
      }

      return { status: 'success', type };
    });

    if (result.status === 'unchanged') {
        return NextResponse.json({ message: "Vote unchanged" });
    }

    // Award Points for upvoting (+1)
    if (type === 1) {
        await prisma.user.update({
            where: { id: userId },
            data: { points: { increment: 1 } }
        });
    }

    return NextResponse.json({ status: 'success', currentVote: type });

  } catch (error) {
    console.error("Topic Vote Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
