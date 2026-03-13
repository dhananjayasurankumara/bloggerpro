import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guides = await prisma.guide.findMany({
      include: {
        _count: {
          select: { steps: true, enrollments: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(guides);
  } catch (error) {
    console.error("Failed to fetch guides:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, price, image, isPremium, slug } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const guide = await prisma.guide.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price) || 0,
        image,
        isPremium: isPremium ?? true,
        published: false
      }
    });

    return NextResponse.json(guide);
  } catch (error) {
    console.error("Failed to create guide:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
