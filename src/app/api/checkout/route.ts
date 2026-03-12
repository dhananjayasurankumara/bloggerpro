import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY || "dummy_key", {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { items } = await request.json();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!process.env.STRIPE_API_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment", // most are one-time products now
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      metadata: {
        userId: (session.user as any).id,
        items: JSON.stringify(items.map((i: any) => i.id)),
      },
      customer_email: session.user.email!,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan");

    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/pricing", request.url));
    }

    if (!process.env.STRIPE_API_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    // Map plans to price IDs (normally these come from env or DB)
    const priceId = plan === "pro" 
      ? "price_pro_monthly" // Placeholder for testing
      : plan === "annual" 
        ? "price_pro_annual" 
        : null;

    if (!priceId && plan !== "free") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // In a real app, you would create or retrieve a Stripe customer ID associated with the user
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan === "pro" ? "BloggerPro Plus (Monthly)" : "BloggerPro Pro (Annual)",
              description: "Full access to premium guides, community, and expert tools.",
            },
            unit_amount: plan === "pro" ? 999 : 7900,
            recurring: {
              interval: plan === "pro" ? "month" : "year",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
    });

    return NextResponse.redirect(checkoutSession.url!, { status: 303 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Checkout Error", { status: 500 });
  }
}
