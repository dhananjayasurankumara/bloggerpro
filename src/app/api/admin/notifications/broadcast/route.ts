import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { content, type = "SYSTEM", target = "ALL" } = body;

    if (!content) {
      return new NextResponse("Missing content", { status: 400 });
    }

    // Determine target users
    let users;
    if (target === "PRO") {
      users = await prisma.user.findMany({
        where: { role: "PRO" },
        select: { id: true }
      });
    } else if (target === "NEW") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      users = await prisma.user.findMany({
        where: { createdAt: { gte: yesterday } },
        select: { id: true }
      });
    } else {
      // DEFAULT: ALL
      users = await prisma.user.findMany({
        select: { id: true }
      });
    }

    if (users.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // Create notifications in a batch (loop for SQLite compatibility if needed, but Prisma 5+ handles createMany)
    // Using a loop for reliable sequential metadata in dev
    const notificationsData = users.map(user => ({
      userId: user.id,
      content,
      type
    }));

    // Promise.all approach for better performance over sequential loop
    await Promise.all(
      notificationsData.map(data => 
        prisma.notification.create({ data })
      )
    );

    return NextResponse.json({ 
      success: true, 
      count: users.length 
    });

  } catch (error) {
    console.error("Broadcast Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
