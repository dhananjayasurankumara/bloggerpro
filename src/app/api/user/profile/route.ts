import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      name, 
      bio, 
      location, 
      website, 
      twitter, 
      linkedin, 
      github, 
      language, 
      timezone, 
      image, 
      coverImage,
      isProfilePublic 
    } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        name,
        bio,
        location,
        website,
        twitter,
        linkedin,
        github,
        language,
        timezone,
        image,
        coverImage,
        isProfilePublic,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
