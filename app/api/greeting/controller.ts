import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIService } from '@/lib/services/AIService';
import { SYSTEM_PROMPT_GREETING } from '@/lib/constants/ai';

const FRESH_GREETING = "Hi! I'm **RAISE**, your AI resume coach. I'll help you build a compelling, gap-free resume through conversation.\n\nI ask the right questions, spot missing pieces in your career story, and turn what you tell me into polished resume content — automatically.\n\nLet's begin: **What's your full name, and what role are you currently in or targeting?**";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { profile, recentMessages } = await req.json();

  const hasMessages = Array.isArray(recentMessages) && recentMessages.length > 0;
  const hasProfile  = profile?.personal?.fullName || profile?.experience?.length > 0 || profile?.education?.length > 0;

  if (!hasMessages && !hasProfile) {
    return NextResponse.json({ message: FRESH_GREETING });
  }

  const ai      = new AIService();
  const trimmed = hasMessages
    ? recentMessages.slice(-6).map((m: { role: string; content: string }) => ({ role: m.role, content: m.content.slice(0, 200) }))
    : [];

  const content = await ai.complete(SYSTEM_PROMPT_GREETING, JSON.stringify({ profile, recentMessages: trimmed }), { temperature: 0.5, maxTokens: 500 });
  const result  = ai.parseJSON(content, { message: content });
  return NextResponse.json(result);
}
