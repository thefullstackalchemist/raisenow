import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findByUserId, upsert } from '@/lib/services/profileDbService';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const profile = await findByUserId(session.user.id);
  return NextResponse.json(profile ?? null);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body    = await req.json();
  const profile = await upsert(session.user.id, body);
  return NextResponse.json(profile);
}
