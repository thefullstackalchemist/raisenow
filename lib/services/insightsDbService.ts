import mongoose from 'mongoose';
import SkillSnapshot from '@/lib/models/SkillSnapshot';
import { connectDB } from '@/lib/mongodb';

export async function getLatestSnapshot(userId: string) {
  await connectDB();
  return SkillSnapshot.findOne({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ generatedAt: -1 })
    .lean();
}

export async function saveSnapshot(userId: string, data: Record<string, unknown>) {
  await connectDB();
  return SkillSnapshot.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $set: { ...data, generatedAt: new Date() } },
    { upsert: true, new: true }
  ).lean();
}
