import mongoose, { Schema, Model } from 'mongoose';

interface ISurvey {
  userId:      mongoose.Types.ObjectId;
  trigger:     'login' | 'quota_exhausted';
  likelyToBuy: number;   // 1–5
  priceRange:  string;
  feedback:    string;
  createdAt:   Date;
}

const SurveySchema = new Schema<ISurvey>(
  {
    userId:      { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    trigger:     { type: String, enum: ['login', 'quota_exhausted'], required: true },
    likelyToBuy: { type: Number, min: 1, max: 5, required: true },
    priceRange:  { type: String, required: true },
    feedback:    { type: String, default: '' },
  },
  { timestamps: true }
);

const Survey: Model<ISurvey> =
  mongoose.models.Survey ?? mongoose.model<ISurvey>('Survey', SurveySchema);

export default Survey;
