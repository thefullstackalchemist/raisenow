export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
}

export interface Profile {
  personal: PersonalDetails;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  fieldHighlight?: string; // which accordion field to highlight
}

export type ActiveField =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | null;

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // CSS class for preview
  isDefault: boolean;
}

export interface CustomRole {
  id: string;
  name: string;
  icon: string;        // emoji
  description: string;
  coreSkills: string[]; // key skills/keywords for this role
  color: string;       // accent hex color
}
