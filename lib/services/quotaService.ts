import mongoose from 'mongoose';
import Quota from '@/lib/models/Quota';
import { connectDB } from '@/lib/mongodb';
import { DAILY_LIMIT } from '@/lib/constants/quota';

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface QuotaResult {
  allowed:   boolean;
  remaining: number;
  used:      number;
}

export async function checkAndIncrement(userId: string): Promise<QuotaResult> {
  await connectDB();
  const doc = await Quota.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId), date: todayUTC() },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  const allowed   = doc.count <= DAILY_LIMIT;
  const remaining = Math.max(0, DAILY_LIMIT - doc.count);
  return { allowed, remaining, used: doc.count };
}

export async function getStatus(userId: string): Promise<{ used: number; remaining: number; limit: number }> {
  await connectDB();
  const doc = await Quota.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    date: todayUTC(),
  }).lean() as { count?: number } | null;
  const used = doc?.count ?? 0;
  return { used, remaining: Math.max(0, DAILY_LIMIT - used), limit: DAILY_LIMIT };
}
