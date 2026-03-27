'use client';

import { useProfile } from '@/lib/ProfileContext';
import styles from './TemplateGrid.module.css';
import { ResumeTemplate } from '@/lib/types';

const TEMPLATE_PREVIEWS: Record<string, React.ReactNode> = {
  classic: <ClassicPreview />,
  modern: <ModernPreview />,
  minimal: <MinimalPreview />,
  executive: <ExecutivePreview />,
  creative: <CreativePreview />,
  technical: <TechnicalPreview />,
};

export default function TemplateGrid() {
  const { templates, setDefaultTemplate, selectedTemplate } = useProfile();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Resume Templates</h1>
        <p className={styles.pageSubtitle}>Choose a layout that best represents your professional story</p>
      </div>

      <div className={styles.grid}>
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => setDefaultTemplate(template.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: ResumeTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      {isSelected && (
        <div className={styles.defaultBadge}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Active
        </div>
      )}

      {/* Thumbnail preview */}
      <div className={styles.thumbnail}>
        {TEMPLATE_PREVIEWS[template.id] || <DefaultThumb />}
      </div>

      {/* Info */}
      <div className={styles.cardBody}>
        <div className={styles.cardInfo}>
          <div className={styles.cardName}>{template.name}</div>
          <div className={styles.cardDesc}>{template.description}</div>
        </div>
        <button
          className={`${styles.selectBtn} ${isSelected ? styles.activeBtn : ''}`}
          onClick={onSelect}
        >
          {isSelected ? 'Selected' : 'Use Template'}
        </button>
      </div>
    </div>
  );
}

/* ── Thumbnail previews ────────────────────────────────────────── */

function ClassicPreview() {
  return (
    <div className={`${styles.thumb} ${styles.thumbClassic}`}>
      <div className={styles.tLine} style={{ width: '70%', height: 10, background: '#2563EB' }} />
      <div className={styles.tLine} style={{ width: '45%', height: 5, marginTop: 5 }} />
      <div className={styles.tDivider} />
      <div className={styles.tGroup}>
        {[90, 60, 80].map((w, i) => <div key={i} className={styles.tLine} style={{ width: `${w}%` }} />)}
      </div>
      <div className={styles.tGroup}>
        {[75, 55, 70].map((w, i) => <div key={i} className={styles.tLine} style={{ width: `${w}%` }} />)}
      </div>
    </div>
  );
}

function ModernPreview() {
  return (
    <div className={`${styles.thumb} ${styles.thumbModern}`}>
      <div style={{ display: 'flex', gap: 6, height: '100%' }}>
        <div style={{ width: '35%', background: '#2563EB', borderRadius: 4, padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[60, 80, 50, 70, 40].map((w, i) => (
            <div key={i} style={{ height: 4, background: 'rgba(255,255,255,0.5)', borderRadius: 2, width: `${w}%` }} />
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div className={styles.tLine} style={{ width: '80%', height: 8 }} />
          {[90, 65, 75, 55].map((w, i) => (
            <div key={i} className={styles.tLine} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MinimalPreview() {
  return (
    <div className={`${styles.thumb} ${styles.thumbMinimal}`}>
      <div className={styles.tLine} style={{ width: '50%', height: 8 }} />
      <div className={styles.tLine} style={{ width: '80%', height: 3, marginTop: 4 }} />
      <div style={{ marginTop: 10 }}>
        {[85, 60, 70, 50, 65, 45].map((w, i) => (
          <div key={i} className={styles.tLine} style={{ width: `${w}%`, marginBottom: 5 }} />
        ))}
      </div>
    </div>
  );
}

function ExecutivePreview() {
  return (
    <div className={`${styles.thumb} ${styles.thumbExecutive}`}>
      <div style={{ background: '#0D1B35', padding: 8, borderRadius: '4px 4px 0 0' }}>
        <div style={{ height: 8, background: 'white', width: '65%', borderRadius: 2 }} />
        <div style={{ height: 4, background: 'rgba(255,255,255,0.4)', width: '45%', borderRadius: 2, marginTop: 4 }} />
      </div>
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div className={styles.tLine} style={{ width: '35%', height: 5, background: '#2563EB' }} />
        {[90, 70, 80].map((w, i) => <div key={i} className={styles.tLine} style={{ width: `${w}%` }} />)}
        <div className={styles.tLine} style={{ width: '35%', height: 5, background: '#2563EB', marginTop: 4 }} />
        {[80, 60].map((w, i) => <div key={i} className={styles.tLine} style={{ width: `${w}%` }} />)}
      </div>
    </div>
  );
}

function CreativePreview() {
  return (
    <div className={`${styles.thumb} ${styles.thumbCreative}`}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: 6, background: 'linear-gradient(to bottom, #2563EB, #60A5FA)', borderRadius: '4px 0 0 4px', flexShrink: 0 }} />
        <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div className={styles.tLine} style={{ width: '60%', height: 9 }} />
          <div className={styles.tLine} style={{ width: '80%', height: 4 }} />
          <div className={styles.tDivider} />
          {[90, 65, 75].map((w, i) => <div key={i} className={styles.tLine} style={{ width: `${w}%` }} />)}
        </div>
      </div>
    </div>
  );
}

function TechnicalPreview() {
  return (
    <div className={`${styles.thumb} ${styles.thumbTechnical}`}>
      <div className={styles.tLine} style={{ width: '55%', height: 8 }} />
      <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
        {[40, 50, 35, 45, 30].map((w, i) => (
          <div key={i} style={{ height: 12, width: w + 'px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 99 }} />
        ))}
      </div>
      <div className={styles.tDivider} />
      {[90, 65, 75, 55].map((w, i) => <div key={i} className={styles.tLine} style={{ width: `${w}%` }} />)}
    </div>
  );
}

function DefaultThumb() {
  return (
    <div className={styles.thumb}>
      <div className={styles.tLine} style={{ width: '60%', height: 8 }} />
      {[90, 70, 80, 60].map((w, i) => <div key={i} className={styles.tLine} style={{ width: `${w}%` }} />)}
    </div>
  );
}
