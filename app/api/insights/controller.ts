import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIService } from '@/lib/services/AIService';
import { SYSTEM_PROMPT_INSIGHTS } from '@/lib/constants/ai';
import { getLatestSnapshot, saveSnapshot } from '@/lib/services/insightsDbService';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snapshot = await getLatestSnapshot(session.user.id);
  return NextResponse.json(snapshot ?? null);
}

interface CustomRoleInput {
  id: string;
  name: string;
  description: string;
  coreSkills: string[];
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { profile, customRoles } = await req.json();

  const customRolePayload = (customRoles as CustomRoleInput[] ?? []).map(r => ({
    id:          r.id,
    name:        r.name,
    description: r.description,
    coreSkills:  r.coreSkills,
  }));

  const ai      = new AIService();
  const content = await ai.complete(
    SYSTEM_PROMPT_INSIGHTS,
    JSON.stringify({
      skills:     profile.skills?.map((s: { name: string }) => s.name) ?? [],
      experience: profile.experience?.map((e: {
        company: string; role: string; startDate: string; endDate: string; current: boolean; highlights: string[];
      }) => ({
        company:    e.company,
        role:       e.role,
        startDate:  e.startDate,
        endDate:    e.endDate,
        current:    e.current,
        highlights: e.highlights,
      })) ?? [],
      customTargetRoles: customRolePayload,
    }),
    { temperature: 0.3, maxTokens: 1400 }
  );

  const fallback = { categories: [], roleFits: [], overallScore: 0, level: 'junior', yearsExperience: 0, topStrengths: [], topGaps: [], summary: '' };
  const result = ai.parseJSON<typeof fallback>(content, fallback);

  const snapshot = await saveSnapshot(session.user.id, result);
  return NextResponse.json(snapshot);
}
