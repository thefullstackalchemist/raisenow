import mongoose from 'mongoose';
import ChatHistory from '@/lib/models/ChatHistory';
import { connectDB } from '@/lib/mongodb';

export async function findByUserId(userId: string) {
  await connectDB();
  const history = await ChatHistory.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean() as { messages?: unknown[] } | null;
  return history?.messages ?? [];
}

export async function append(userId: string, message: unknown) {
  await connectDB();
  await ChatHistory.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $push: { messages: message } },
    { upsert: true }
  );
}

export async function clear(userId: string) {
  await connectDB();
  await ChatHistory.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $set: { messages: [] } }
  );
}
