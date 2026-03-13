import bcrypt from "bcryptjs";
/* Forced Redeploy: Standardizing hashing logic */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Detect placeholder/disconnected database
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes("user:password")) {
      return new NextResponse("Database Restricted: Feature unavailable in local disconnected mode.", { status: 503 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "FREE",
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("[REGISTRATION_ERROR]", error);
    return new NextResponse("Database unavailable. Please check your connection.", { status: 500 });
  }
}
