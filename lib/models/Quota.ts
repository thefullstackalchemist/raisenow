import mongoose, { Schema, Model } from 'mongoose';

interface IQuota {
  userId: mongoose.Types.ObjectId;
  date:   string; // YYYY-MM-DD UTC
  count:  number;
}

const QuotaSchema = new Schema<IQuota>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  date:   { type: String, required: true },
  count:  { type: Number, default: 0 },
});

QuotaSchema.index({ userId: 1, date: 1 }, { unique: true });

const Quota: Model<IQuota> =
  mongoose.models.Quota || mongoose.model<IQuota>('Quota', QuotaSchema);

export default Quota;
