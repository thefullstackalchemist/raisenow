'use client';
import { TemplateProps } from './types';

export default function MinimalTemplate({ profile, theme }: TemplateProps) {
  const { personal, experience, education, skills, projects } = profile;
  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean);

  const s = {
    root: { fontFamily: '"Inter", Arial, sans-serif', color: theme.text, background: 'white', width: '100%', maxWidth: 700, minHeight: 900, padding: '60px 64px' } as React.CSSProperties,
    header: { textAlign: 'center' as const, marginBottom: 40, paddingBottom: 32, borderBottom: `1px solid ${theme.border}` },
    name: { fontSize: '2.4rem', fontWeight: 300, color: theme.heading, letterSpacing: '0.04em', marginBottom: 12 } as React.CSSProperties,
    contactRow: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap' as const, gap: '2px 12px', fontSize: '0.78rem', color: theme.muted },
    sep: { color: theme.border },
    summary: { marginTop: 16, fontSize: '0.875rem', color: theme.text, lineHeight: 1.8, maxWidth: 500, margin: '16px auto 0' } as React.CSSProperties,
    section: { marginBottom: 32 } as React.CSSProperties,
    sectionTitle: { fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: theme.muted, marginBottom: 16 },
    expItem: { marginBottom: 20, display: 'flex', justifyContent: 'space-between', gap: 16 } as React.CSSProperties,
    expLeft: { flex: 1 } as React.CSSProperties,
    expRight: { textAlign: 'right' as const, flexShrink: 0 },
    expRole: { fontSize: '0.88rem', fontWeight: 600, color: theme.heading },
    expCompany: { fontSize: '0.78rem', color: theme.text, marginTop: 2 },
    expDates: { fontSize: '0.75rem', color: theme.muted },
    ul: { marginTop: 8, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' as const, gap: 4 },
    li: { fontSize: '0.8rem', color: theme.text, lineHeight: 1.65, paddingLeft: 14, position: 'relative' as const },
    bullet: { position: 'absolute' as const, left: 0, color: theme.primary, fontSize: '0.55rem', top: 4 },
    rule: { height: 1, background: theme.border, marginBottom: 20 } as React.CSSProperties,
    skillsWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: 6 },
    skillTag: { fontSize: '0.78rem', color: theme.text, background: theme.primaryLight, padding: '3px 10px', borderRadius: 3 },
  };

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.name}>{personal.fullName || 'Your Name'}</div>
        <div style={s.contactRow}>
          {contactItems.map((item, i) => (
            <span key={i}>{i > 0 && <span style={s.sep}> · </span>}{item}</span>
          ))}
        </div>
        {personal.summary && <div style={s.summary}>{personal.summary}</div>}
      </header>

      {experience.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}>Experience</div>
          <div style={s.rule} />
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 20 }}>
              <div style={s.expItem}>
                <div style={s.expLeft}>
                  <div style={s.expRole}>{exp.role}</div>
                  <div style={s.expCompany}>{exp.company}</div>
                </div>
                <div style={s.expRight}>
                  <div style={s.expDates}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</div>
                </div>
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
          <div style={s.rule} />
          {education.map(edu => (
            <div key={edu.id} style={s.expItem}>
              <div style={s.expLeft}>
                <div style={s.expRole}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                <div style={s.expCompany}>{edu.institution}</div>
              </div>
              <div style={s.expRight}>
                <div style={s.expDates}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}>Skills</div>
          <div style={s.rule} />
          <div style={s.skillsWrap}>
            {skills.map(sk => <span key={sk.id} style={s.skillTag}>{sk.name}</span>)}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}>Projects</div>
          <div style={s.rule} />
          {projects.map(pr => (
            <div key={pr.id} style={{ marginBottom: 16 }}>
              <div style={s.expRole}>{pr.name}</div>
              {pr.description && <div style={{ fontSize: '0.8rem', color: theme.text, marginTop: 4, lineHeight: 1.65 }}>{pr.description}</div>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
