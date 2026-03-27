import mongoose from 'mongoose';
import ProfileModel from '@/lib/models/Profile';
import { connectDB } from '@/lib/mongodb';

export async function findByUserId(userId: string) {
  await connectDB();
  return ProfileModel.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean();
}

export async function upsert(userId: string, data: Record<string, unknown>) {
  await connectDB();
  return ProfileModel.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $set: { ...data, userId: new mongoose.Types.ObjectId(userId) } },
    { upsert: true, new: true }
  );
}
