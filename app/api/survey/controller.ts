import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Survey from '@/lib/models/Survey';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { trigger, likelyToBuy, priceRange, feedback } = await req.json();

  if (!trigger || !likelyToBuy || !priceRange) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await dbConnect();
  await Survey.create({
    userId: session.user.id,
    trigger,
    likelyToBuy,
    priceRange,
    feedback: feedback ?? '',
  });

  return NextResponse.json({ ok: true });
}
