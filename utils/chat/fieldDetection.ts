import { ActiveField } from '@/lib/types';
import { FIELD_MAP } from './constants';

export function detectField(text: string): ActiveField {
  const lower = text.toLowerCase();
  for (const [kw, field] of Object.entries(FIELD_MAP)) {
    if (lower.includes(kw)) return field;
  }
  return null;
}
