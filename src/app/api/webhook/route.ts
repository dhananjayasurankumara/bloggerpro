import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_API_KEY || "dummy_key", {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          role: "PRO", // Upgrade user to PRO
        },
      });
      
      console.log(`User ${userId} upgraded to PRO via Stripe`);
    }
  }

  return new NextResponse(null, { status: 200 });
}
