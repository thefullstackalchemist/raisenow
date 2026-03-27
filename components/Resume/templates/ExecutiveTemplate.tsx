'use client';
import { TemplateProps } from './types';

export default function ExecutiveTemplate({ profile, theme }: TemplateProps) {
  const { personal, experience, education, skills, projects } = profile;
  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean);

  const s = {
    root: { fontFamily: '"Inter", Arial, sans-serif', color: theme.text, background: 'white', width: '100%', maxWidth: 740, minHeight: 900, padding: '52px 60px' } as React.CSSProperties,
    header: { textAlign: 'center' as const, marginBottom: 32 },
    name: { fontSize: '2rem', fontWeight: 700, color: theme.heading, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 10 } as React.CSSProperties,
    contactRow: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap' as const, gap: '2px 16px', fontSize: '0.78rem', color: theme.muted, marginBottom: 16 },
    doubleRule: { borderTop: `2px solid ${theme.heading}`, borderBottom: `1px solid ${theme.heading}`, height: 4, marginBottom: 24 } as React.CSSProperties,
    summary: { fontSize: '0.875rem', color: theme.text, lineHeight: 1.75, textAlign: 'center' as const, maxWidth: 560, margin: '0 auto 28px' } as React.CSSProperties,
    section: { marginBottom: 26 } as React.CSSProperties,
    sectionTitle: { display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: theme.heading, marginBottom: 14 },
    sectionBar: { width: 3, height: 14, background: theme.primary, borderRadius: 2, flexShrink: 0 },
    sectionRule: { flex: 1, height: 1, background: theme.border, marginLeft: 8 } as React.CSSProperties,
    expItem: { marginBottom: 18 } as React.CSSProperties,
    expHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 4 } as React.CSSProperties,
    expRole: { fontSize: '0.82rem', fontWeight: 700, color: theme.heading, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
    expCompany: { fontSize: '0.8rem', color: theme.primary, fontWeight: 500, marginTop: 1 },
    expDates: { fontSize: '0.72rem', color: theme.muted, whiteSpace: 'nowrap' as const },
    ul: { marginTop: 8, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' as const, gap: 4 },
    li: { fontSize: '0.82rem', color: theme.text, lineHeight: 1.6, paddingLeft: 16, position: 'relative' as const },
    bullet: { position: 'absolute' as const, left: 0, color: theme.primary, fontSize: '0.65rem', top: 3 },
    skillsWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: 7 },
    skillTag: { padding: '3px 12px', border: `1px solid ${theme.primary}`, borderRadius: 2, fontSize: '0.78rem', color: theme.accent, fontWeight: 500 },
  };

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.name}>{personal.fullName || 'Your Name'}</div>
        <div style={s.contactRow}>
          {contactItems.map((item, i) => <span key={i}>{i > 0 && <span style={{ opacity: 0.4 }}> · </span>}{item}</span>)}
        </div>
        <div style={s.doubleRule} />
        {personal.summary && <div style={s.summary}>{personal.summary}</div>}
      </header>

      {experience.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}>
            <span style={s.sectionBar} />
            Professional Experience
            <div style={s.sectionRule} />
          </div>
          {experience.map(exp => (
            <div key={exp.id} style={s.expItem}>
              <div style={s.expHeader}>
                <div>
                  <div style={s.expRole}>{exp.role}</div>
                  <div style={s.expCompany}>{exp.company}</div>
                </div>
                <div style={s.expDates}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</div>
              </div>
              {exp.highlights.length > 0 && (
                <ul style={s.ul}>
                  {exp.highlights.map((h, i) => <li key={i} style={s.li}><span style={s.bullet}>▸</span>{h}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}><span style={s.sectionBar} />Education<div style={s.sectionRule} /></div>
          {education.map(edu => (
            <div key={edu.id} style={s.expItem}>
              <div style={s.expHeader}>
                <div>
                  <div style={s.expRole}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                  <div style={s.expCompany}>{edu.institution}</div>
                </div>
                <div style={s.expDates}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}><span style={s.sectionBar} />Skills<div style={s.sectionRule} /></div>
          <div style={s.skillsWrap}>
            {skills.map(sk => <span key={sk.id} style={s.skillTag}>{sk.name}</span>)}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}><span style={s.sectionBar} />Projects<div style={s.sectionRule} /></div>
          {projects.map(pr => (
            <div key={pr.id} style={s.expItem}>
              <div style={s.expRole}>{pr.name}</div>
              {pr.description && <div style={{ fontSize: '0.82rem', color: theme.text, marginTop: 4, lineHeight: 1.65 }}>{pr.description}</div>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
