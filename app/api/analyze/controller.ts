import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIService } from '@/lib/services/AIService';
import { SYSTEM_PROMPT_ANALYZE } from '@/lib/constants/ai';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { jobDesc, profile } = await req.json();
  const ai      = new AIService();
  const content = await ai.complete(SYSTEM_PROMPT_ANALYZE, `Job Description:\n${jobDesc}\n\nCandidate Profile:\n${JSON.stringify(profile, null, 2)}`, { temperature: 0.3, maxTokens: 600 });
  const result  = ai.parseJSON(content, { matchedSkills: [], missingSkills: [], suggestions: ['Analysis failed — please try again.'], score: 0 });
  return NextResponse.json(result);
}
