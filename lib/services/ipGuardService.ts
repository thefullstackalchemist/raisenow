import IPGuard from '@/lib/models/IPGuard';
import { connectDB } from '@/lib/mongodb';
import { MAX_REGISTRATIONS_PER_IP } from '@/lib/constants/quota';

export async function checkAndIncrement(ip: string): Promise<{ allowed: boolean }> {
  await connectDB();
  const doc = await IPGuard.findOneAndUpdate(
    { ip },
    { $inc: { registrations: 1 } },
    { upsert: true, new: true }
  );
  return { allowed: doc.registrations <= MAX_REGISTRATIONS_PER_IP };
}
