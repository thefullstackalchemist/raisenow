import { Profile, CustomRole } from '@/lib/types';

export interface SnapshotData {
  categories:      Array<{ name: string; score: number; matchedSkills: string[]; inferredSkills?: string[] }>;
  roleFits:        Array<{ roleId: string; score: number; gapSkills: string[]; recommendation: string }>;
  overallScore:    number;
  level:           string;
  yearsExperience: number;
  topStrengths:    string[];
  topGaps:         string[];
  summary:         string;
  generatedAt?:    string;
}

export async function fetchLatestSnapshot(): Promise<SnapshotData | null> {
  const res = await fetch('/api/insights');
  if (!res.ok) return null;
  return res.json();
}

export async function generateSnapshot(profile: Profile, customRoles: CustomRole[] = []): Promise<SnapshotData | null> {
  const res = await fetch('/api/insights', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ profile, customRoles }),
  });
  if (!res.ok) return null;
  return res.json();
}
