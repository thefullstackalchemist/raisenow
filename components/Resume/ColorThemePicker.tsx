'use client';
import { COLOR_THEMES, ColorTheme } from '@/utils/resume/colorThemes';
import styles from './ColorThemePicker.module.css';

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function ColorThemePicker({ selected, onChange }: Props) {
  return (
    <div className={styles.picker}>
      <span className={styles.label}>Colour</span>
      <div className={styles.swatches}>
        {COLOR_THEMES.map((theme: ColorTheme) => (
          <button
            key={theme.id}
            className={`${styles.swatch} ${selected === theme.id ? styles.active : ''}`}
            style={{ background: theme.primary }}
            onClick={() => onChange(theme.id)}
            title={theme.name}
            aria-label={theme.name}
          >
            {selected === theme.id && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
