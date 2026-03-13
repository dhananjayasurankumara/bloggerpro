import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, order } = body;

    if (!title || content === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const step = await prisma.guideStep.create({
      data: {
        title,
        content,
        order: order ?? 0,
        guideId: params.id
      }
    });

    return NextResponse.json(step);
  } catch (error) {
    console.error("Failed to create guide step:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { steps } = body; // Array of {id, order}

    if (!Array.isArray(steps)) {
      return NextResponse.json({ error: "Invalid steps data" }, { status: 400 });
    }

    // Batch update orders
    await Promise.all(
      steps.map((step) => 
        prisma.guideStep.update({
          where: { id: step.id },
          data: { order: step.order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder steps:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
