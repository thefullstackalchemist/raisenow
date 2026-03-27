export interface QuotaStatus {
  used:      number;
  remaining: number;
  limit:     number;
}

export async function fetchQuotaStatus(): Promise<QuotaStatus> {
  try {
    const res = await fetch('/api/quota');
    if (!res.ok) return { used: 0, remaining: 10, limit: 10 };
    return res.json();
  } catch {
    return { used: 0, remaining: 10, limit: 10 };
  }
}
