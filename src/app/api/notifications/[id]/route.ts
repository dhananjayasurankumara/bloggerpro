import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    // Verify ownership and update
    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification || notification.userId !== userId) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Mark Single Read Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
