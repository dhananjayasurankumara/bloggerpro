import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase().trim();

    if (!lastUserMessage) {
      return NextResponse.json({ 
        content: "I didn't quite catch that. Could you try rephrasing or type 'help' for a list of topics I can assist with?" 
      });
    }

    // 1. Precise Match Search
    let matchedCommand = await prisma.botCommand.findUnique({
      where: { command: lastUserMessage }
    });

    // 2. Keyword/Partial Match Search (Optional fallback for better UX)
    if (!matchedCommand) {
      const allCommands = await prisma.botCommand.findMany({ where: { active: true } });
      matchedCommand = allCommands.find(c => 
        lastUserMessage.includes(c.command.toLowerCase()) || 
        c.command.toLowerCase().includes(lastUserMessage)
      ) || null;
    }

    if (matchedCommand && matchedCommand.active) {
      return NextResponse.json({ content: matchedCommand.response });
    }

    // 3. Smart Fallback / Recommendation
    const fallbackResponse = "I'm specializing in precision financial insights right now and don't recognize that specific query. Try asking about 'passive income', 'real estate', or type 'help' to see my full knowledge base.";
    
    return NextResponse.json({ content: fallbackResponse });

  } catch (error: any) {
    console.error("ProBot API Error:", error);
    return NextResponse.json({ 
      content: "I'm experiencing a brief synchronization delay. Please try your request again in a moment."
    }, { status: 500 });
  }
}
