'use client';

import { useProfile } from '@/lib/ProfileContext';
import styles from './ResumePreview.module.css';
import { useRef } from 'react';
import { TEMPLATE_REGISTRY, TEMPLATES } from './templates';
import { getThemeById } from '@/utils/resume/colorThemes';
import ColorThemePicker from './ColorThemePicker';

export default function ResumePreview() {
  const { profile, selectedTemplate, setDefaultTemplate, colorTheme, setColorTheme } = useProfile();
  const { personal } = profile;
  const printRef = useRef<HTMLDivElement>(null);

  const TemplateComponent = TEMPLATE_REGISTRY[selectedTemplate] || TEMPLATE_REGISTRY.classic;
  const theme = getThemeById(colorTheme);

  const handlePrint = () => {
    const node = printRef.current;
    if (!node) return;

    const win = window.open('', '_blank');
    if (!win) {
      alert('Pop-up blocked. Please allow pop-ups for this site and try again.');
      return;
    }

    win.document.write(`<!DOCTYPE html><html>
<head>
  <meta charset="utf-8">
  <title>${personal.fullName || 'Resume'} — Resume</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: white; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @media print { @page { margin: 0.4in 0.5in; size: letter; } }
    body > div { display: flex; justify-content: center; padding: 0; }
  </style>
</head>
<body><div>${node.outerHTML}</div></body></html>`);

    win.document.close();

    win.addEventListener('load', () => {
      win.focus();
      win.print();
    });
    setTimeout(() => {
      if (!win.closed) { win.focus(); win.print(); }
    }, 900);
  };

  const hasContent = personal.fullName || profile.experience.length > 0 || profile.education.length > 0;

  return (
    <div className={styles.wrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.templateSelector}>
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                className={`${styles.templateBtn} ${selectedTemplate === t.id ? styles.templateBtnActive : ''}`}
                onClick={() => setDefaultTemplate(t.id)}
                title={t.description}
              >
                {t.name}
              </button>
            ))}
          </div>
          <ColorThemePicker selected={colorTheme} onChange={setColorTheme} />
        </div>
        <div className={styles.toolbarRight}>
          <button className={styles.toolbarBtn} onClick={handlePrint}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 6,2 18,2 18,9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Resume canvas */}
      <div className={styles.canvas}>
        {!hasContent ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <h3>Your resume will appear here</h3>
            <p>Fill in your details on the Dashboard or paste a job description to get started.</p>
          </div>
        ) : (
          <div ref={printRef}>
            <TemplateComponent profile={profile} theme={theme} />
          </div>
        )}
      </div>
    </div>
  );
}
