import { Profile } from '@/lib/types';
import { ColorTheme } from '@/utils/resume/colorThemes';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import type React from 'react';

export type { TemplateProps } from './types';

export interface TemplateMeta {
  id:          string;
  name:        string;
  description: string;
}

export const TEMPLATES: TemplateMeta[] = [
  { id: 'classic',   name: 'Classic',   description: 'Clean, traditional layout — works everywhere' },
  { id: 'modern',    name: 'Modern',    description: 'Bold coloured header with accent section titles' },
  { id: 'minimal',   name: 'Minimal',   description: 'Ultra-clean, maximum whitespace' },
  { id: 'executive', name: 'Executive', description: 'Formal and commanding — great for senior roles' },
];

export interface TemplateComponentProps {
  profile: Profile;
  theme:   ColorTheme;
}

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<TemplateComponentProps>> = {
  classic:   ClassicTemplate,
  modern:    ModernTemplate,
  minimal:   MinimalTemplate,
  executive: ExecutiveTemplate,
};
