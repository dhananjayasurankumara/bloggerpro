import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" }
    });

    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      siteName, 
      siteDescription, 
      contactEmail, 
      primaryColor, 
      logoUrl, 
      adClient, 
      adsEnabled, 
      chatbotEnabled, 
      chatbotName, 
      chatbotWelcome 
    } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        siteName,
        siteDescription,
        contactEmail,
        primaryColor,
        logoUrl,
        adClient,
        adsEnabled,
        chatbotEnabled,
        chatbotName,
        chatbotWelcome,
      },
      create: {
        id: "singleton",
        siteName,
        siteDescription,
        contactEmail,
        primaryColor,
        logoUrl,
        adClient,
        adsEnabled,
        chatbotEnabled,
        chatbotName,
        chatbotWelcome,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
