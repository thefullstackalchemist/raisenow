import mongoose, { Schema, Model } from 'mongoose';

const CategorySchema = new Schema({
  name:           { type: String },
  score:          { type: Number },
  matchedSkills:  [String],
  inferredSkills: [String],
}, { _id: false });

const RoleFitSchema = new Schema({
  roleId:         { type: String },
  score:          { type: Number },
  gapSkills:      [String],
  recommendation: { type: String },
}, { _id: false });

interface ISkillSnapshot {
  userId:          mongoose.Types.ObjectId;
  generatedAt:     Date;
  categories:      Array<{ name: string; score: number; matchedSkills: string[]; inferredSkills: string[] }>;
  roleFits:        Array<{ roleId: string; score: number; gapSkills: string[]; recommendation: string }>;
  overallScore:    number;
  level:           string;
  yearsExperience: number;
  topStrengths:    string[];
  topGaps:         string[];
  summary:         string;
}

const SkillSnapshotSchema = new Schema<ISkillSnapshot>({
  userId:          { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  generatedAt:     { type: Date, default: Date.now },
  categories:      [CategorySchema],
  roleFits:        [RoleFitSchema],
  overallScore:    { type: Number, default: 0 },
  level:           { type: String, default: 'junior' },
  yearsExperience: { type: Number, default: 0 },
  topStrengths:    [String],
  topGaps:         [String],
  summary:         { type: String, default: '' },
});

const SkillSnapshot: Model<ISkillSnapshot> =
  mongoose.models.SkillSnapshot || mongoose.model<ISkillSnapshot>('SkillSnapshot', SkillSnapshotSchema);

export default SkillSnapshot;
