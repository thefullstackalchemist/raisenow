import mongoose, { Schema, Document, Model } from 'mongoose';

const PersonalSchema = new Schema({
  fullName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  website: { type: String, default: '' },
  summary: { type: String, default: '' },
}, { _id: false });

const ExperienceSchema = new Schema({
  id: { type: String, required: true },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
}, { _id: false });

const EducationSchema = new Schema({
  id: { type: String, required: true },
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String },
  highlights: [{ type: String }],
}, { _id: false });

const SkillSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  level: { type: String, default: 'intermediate' },
}, { _id: false });

const ProjectSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  url: { type: String },
  technologies: [{ type: String }],
}, { _id: false });

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    highlights: string[];
  }>;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    level: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    url?: string;
    technologies: string[];
  }>;
  selectedTemplate: string;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    personal: { type: PersonalSchema, default: () => ({}) },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    selectedTemplate: { type: String, default: 'classic' },
  },
  { timestamps: true }
);

const ProfileModel: Model<IProfile> =
  mongoose.models.Profile ?? mongoose.model<IProfile>('Profile', ProfileSchema);

export default ProfileModel;
