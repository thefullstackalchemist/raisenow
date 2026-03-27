import { Gap } from '@/utils/resume/scoring';

export async function fetchAIGaps(sanitizedProfile: unknown): Promise<Gap[]> {
  try {
    const res = await fetch('/api/completeness', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ profile: sanitizedProfile }),
    });
    const data = await res.json();
    return data.gaps ?? [];
  } catch {
    return [];
  }
}
