import { ActiveField } from '@/lib/types';

export const FIELD_MAP: Record<string, ActiveField> = {
  personal: 'personal', name: 'personal', email: 'personal', phone: 'personal',
  location: 'personal', summary: 'personal', linkedin: 'personal',
  experience: 'experience', work: 'experience', job: 'experience', company: 'experience',
  education: 'education', study: 'education', university: 'education', degree: 'education',
  skills: 'skills', skill: 'skills', technology: 'skills', tools: 'skills',
  projects: 'projects', project: 'projects',
};
