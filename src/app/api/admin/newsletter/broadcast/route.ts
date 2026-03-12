import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Fetch all active subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      select: { email: true }
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers to send to." });
    }

    // MOCK EMAIL BROADCAST LOGIC
    // In a production app, you would integrate with Resend, SendGrid, or AWS SES here.
    console.log(`[BROADCAST] Sending email: "${subject}" to ${subscribers.length} subscribers.`);
    
    // We can iterate and "send" them (log for now)
    // const results = await Promise.all(subscribers.map(sub => sendEmail(sub.email, subject, message)));

    return NextResponse.json({ 
      message: `Broadcast successfully sent to ${subscribers.length} subscribers.`,
      count: subscribers.length
    });
  } catch (error) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
