import { Profile } from '@/lib/types';
import { ColorTheme } from '@/utils/resume/colorThemes';

export interface TemplateProps {
  profile: Profile;
  theme:   ColorTheme;
}
