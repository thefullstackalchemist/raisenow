import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { checkAndIncrement } from '@/lib/services/ipGuardService';

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '0.0.0.0';
}

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name?.trim() || !email?.trim() || !password)
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });

  if (password.length < 8)
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });

  const ip     = getClientIP(req);
  const ipCheck = await checkAndIncrement(ip);
  if (!ipCheck.allowed)
    return NextResponse.json({ error: 'Maximum accounts reached for this network. Contact support if you need help.' }, { status: 429 });

  await connectDB();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing)
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });

  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed });

  return NextResponse.json({ success: true }, { status: 201 });
}
