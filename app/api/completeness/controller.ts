import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIService } from '@/lib/services/AIService';
import { SYSTEM_PROMPT_COMPLETENESS } from '@/lib/constants/ai';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { profile } = await req.json();
  const ai      = new AIService();
  const content = await ai.complete(SYSTEM_PROMPT_COMPLETENESS, `Audit this profile for completeness gaps:\n${JSON.stringify(profile, null, 2)}`, { temperature: 0.2, maxTokens: 800 });
  const result  = ai.parseJSON(content, { gaps: [] });
  return NextResponse.json(result);
}
