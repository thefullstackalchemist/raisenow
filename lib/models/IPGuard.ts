import mongoose, { Schema, Model } from 'mongoose';

interface IIPGuard {
  ip:            string;
  registrations: number;
}

const IPGuardSchema = new Schema<IIPGuard>({
  ip:            { type: String, required: true, unique: true },
  registrations: { type: Number, default: 0 },
});

const IPGuard: Model<IIPGuard> =
  mongoose.models.IPGuard || mongoose.model<IIPGuard>('IPGuard', IPGuardSchema);

export default IPGuard;
