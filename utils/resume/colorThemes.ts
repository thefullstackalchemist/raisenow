export interface ColorTheme {
  id:           string;
  name:         string;
  primary:      string;
  primaryLight: string;
  heading:      string;
  text:         string;
  muted:        string;
  border:       string;
  accent:       string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'blue', name: 'Ocean Blue',
    primary: '#2563EB', primaryLight: '#EFF6FF', heading: '#0D1B35',
    text: '#4A5D80', muted: '#8099B8', border: '#E4EDFF', accent: '#1D4ED8',
  },
  {
    id: 'slate', name: 'Charcoal',
    primary: '#374151', primaryLight: '#F9FAFB', heading: '#111827',
    text: '#4B5563', muted: '#9CA3AF', border: '#E5E7EB', accent: '#1F2937',
  },
  {
    id: 'emerald', name: 'Forest',
    primary: '#059669', primaryLight: '#ECFDF5', heading: '#064E3B',
    text: '#374151', muted: '#6B7280', border: '#D1FAE5', accent: '#047857',
  },
  {
    id: 'rose', name: 'Crimson',
    primary: '#DC2626', primaryLight: '#FEF2F2', heading: '#1C0A0A',
    text: '#374151', muted: '#6B7280', border: '#FEE2E2', accent: '#B91C1C',
  },
  {
    id: 'violet', name: 'Violet',
    primary: '#7C3AED', primaryLight: '#F5F3FF', heading: '#1E0A3C',
    text: '#374151', muted: '#6B7280', border: '#EDE9FE', accent: '#6D28D9',
  },
];

export const DEFAULT_THEME = COLOR_THEMES[0];

export function getThemeById(id: string): ColorTheme {
  return COLOR_THEMES.find(t => t.id === id) ?? DEFAULT_THEME;
}
