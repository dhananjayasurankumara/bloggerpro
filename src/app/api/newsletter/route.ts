import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (!existing.active) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { active: true }
        });
        return NextResponse.json({ message: "Welcome back! Subscription reactivated." });
      }
      return new NextResponse("Already subscribed", { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email }
    });

    return NextResponse.json({ message: "Successfully subscribed to BloggerPro newsletter!" });
  } catch (error) {
    console.error(error, "NEWSLETTER_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
