import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    let products: any[] = [];
    try {
        products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" }
        });
    } catch (e) {
        products = await prisma.$queryRawUnsafe(`SELECT * FROM Product ORDER BY createdAt DESC`);
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, price, image, downloadUrl, category, isFeatured } = body;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        image,
        downloadUrl,
        category,
        isFeatured: isFeatured || false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    // Try raw query fallback for creation if model is not in client
    try {
        const body = await req.clone().json();
        const { title, description, price, image, downloadUrl, category, isFeatured } = body;
        const now = new Date().toISOString();
        const id = Math.random().toString(36).substring(7);
        
        await prisma.$executeRawUnsafe(`
            INSERT INTO Product (id, title, description, price, image, downloadUrl, isFeatured, category, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, id, title, description, parseFloat(price), image, downloadUrl, isFeatured ? 1 : 0, category, now, now);
        
        return NextResponse.json({ success: true });
    } catch (rawError) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
  }
}
