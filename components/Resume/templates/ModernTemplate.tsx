'use client';
import { TemplateProps } from './types';

export default function ModernTemplate({ profile, theme }: TemplateProps) {
  const { personal, experience, education, skills, projects } = profile;

  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean);

  const s = {
    root: { fontFamily: '"Inter", Arial, sans-serif', background: 'white', width: '100%', maxWidth: 740, minHeight: 900 } as React.CSSProperties,
    header: { background: theme.primary, padding: '36px 48px 32px', color: 'white' } as React.CSSProperties,
    name: { fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 } as React.CSSProperties,
    role: { fontSize: '1rem', fontWeight: 400, opacity: 0.85, marginBottom: 14 } as React.CSSProperties,
    contactRow: { display: 'flex', flexWrap: 'wrap' as const, gap: '4px 20px', fontSize: '0.78rem', opacity: 0.9 },
    body: { padding: '36px 48px' } as React.CSSProperties,
    section: { marginBottom: 28 } as React.CSSProperties,
    sectionTitle: { fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: theme.primary, paddingLeft: 12, borderLeft: `3px solid ${theme.primary}`, marginBottom: 14, lineHeight: 1.4 },
    expItem: { marginBottom: 18, paddingLeft: 12 } as React.CSSProperties,
    expHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 } as React.CSSProperties,
    expRole: { fontSize: '0.9rem', fontWeight: 600, color: theme.heading },
    expCompany: { fontSize: '0.8rem', color: theme.text, marginTop: 1 },
    expDates: { fontSize: '0.75rem', color: theme.muted, whiteSpace: 'nowrap' as const, flexShrink: 0, background: theme.primaryLight, padding: '2px 8px', borderRadius: 99, border: `1px solid ${theme.border}` },
    summary: { fontSize: '0.875rem', color: theme.text, lineHeight: 1.7, paddingLeft: 12 } as React.CSSProperties,
    ul: { marginTop: 8, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' as const, gap: 5 },
    li: { fontSize: '0.82rem', color: theme.text, lineHeight: 1.6, paddingLeft: 16, position: 'relative' as const },
    bullet: { position: 'absolute' as const, left: 0, color: theme.primary, fontSize: '0.65rem', top: 3 },
    skillsWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: 8, paddingLeft: 12 },
    skillTag: { padding: '4px 12px', background: theme.primaryLight, color: theme.accent, borderRadius: 99, fontSize: '0.78rem', fontWeight: 500, border: `1px solid ${theme.border}` },
  };

  const currentRole = experience.find(e => e.current)?.role || experience[0]?.role || '';

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.name}>{personal.fullName || 'Your Name'}</div>
        {currentRole && <div style={s.role}>{currentRole}</div>}
        <div style={s.contactRow}>
          {contactItems.map((item, i) => <span key={i}>{item}</span>)}
        </div>
      </header>

      <div style={s.body}>
        {personal.summary && (
          <section style={s.section}>
            <div style={s.sectionTitle}>About</div>
            <div style={s.summary}>{personal.summary}</div>
          </section>
        )}

        {experience.length > 0 && (
          <section style={s.section}>
            <div style={s.sectionTitle}>Experience</div>
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
            <div style={s.sectionTitle}>Education</div>
            {education.map(edu => (
              <div key={edu.id} style={{ ...s.expItem }}>
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
            <div style={s.sectionTitle}>Skills</div>
            <div style={s.skillsWrap}>
              {skills.map(sk => <span key={sk.id} style={s.skillTag}>{sk.name}</span>)}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section style={s.section}>
            <div style={s.sectionTitle}>Projects</div>
            {projects.map(pr => (
              <div key={pr.id} style={s.expItem}>
                <div style={s.expRole}>{pr.name}</div>
                {pr.description && <div style={{ ...s.summary, paddingLeft: 0, marginTop: 4 }}>{pr.description}</div>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
