'use client';
import { TemplateProps } from './types';

export default function ClassicTemplate({ profile, theme }: TemplateProps) {
  const { personal, experience, education, skills, projects } = profile;

  const s = {
    root: { fontFamily: '"Inter", Arial, sans-serif', color: theme.text, background: 'white', width: '100%', maxWidth: 740, minHeight: 900, padding: '48px 56px' } as React.CSSProperties,
    header: { borderBottom: `2px solid ${theme.primary}`, paddingBottom: 20, marginBottom: 28 } as React.CSSProperties,
    name: { fontSize: '2rem', fontWeight: 700, color: theme.heading, marginBottom: 8, letterSpacing: '-0.02em' } as React.CSSProperties,
    contact: { display: 'flex', flexWrap: 'wrap' as const, gap: '4px 0', fontSize: '0.8rem', color: theme.muted, marginBottom: 12 },
    contactSpan: { marginRight: 16 },
    contactSep: { marginRight: 16, color: theme.border },
    summary: { fontSize: '0.875rem', color: theme.text, lineHeight: 1.7, marginTop: 10 } as React.CSSProperties,
    section: { marginBottom: 24 } as React.CSSProperties,
    sectionTitle: { fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: theme.primary, marginBottom: 6 },
    sectionRule: { height: 1, background: theme.border, marginBottom: 14 } as React.CSSProperties,
    expItem: { marginBottom: 16 } as React.CSSProperties,
    expHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 4 } as React.CSSProperties,
    role: { fontSize: '0.9rem', fontWeight: 600, color: theme.heading },
    company: { fontSize: '0.8rem', color: theme.text, fontWeight: 500, marginTop: 1 },
    dates: { fontSize: '0.75rem', color: theme.muted, whiteSpace: 'nowrap' as const, flexShrink: 0 },
    desc: { fontSize: '0.82rem', color: theme.text, lineHeight: 1.65, marginTop: 6 } as React.CSSProperties,
    ul: { marginTop: 7, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' as const, gap: 4 },
    li: { fontSize: '0.82rem', color: theme.text, lineHeight: 1.6, paddingLeft: 16, position: 'relative' as const },
    bullet: { position: 'absolute' as const, left: 0, color: theme.primary, fontSize: '0.65rem', top: 3 },
    skillsList: { display: 'flex', flexWrap: 'wrap' as const, gap: 6 },
    skillTag: { padding: '3px 10px', background: theme.primaryLight, border: `1px solid ${theme.border}`, borderRadius: 4, fontSize: '0.78rem', color: theme.accent, fontWeight: 500 },
  };

  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.name}>{personal.fullName || 'Your Name'}</div>
        <div style={s.contact}>
          {contactItems.map((item, i) => (
            <span key={i} style={s.contactSpan}>
              {i > 0 && <span style={s.contactSep}>·</span>}
              {item}
            </span>
          ))}
        </div>
        {personal.summary && <div style={s.summary}>{personal.summary}</div>}
      </header>

      {experience.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}>Work Experience</div>
          <div style={s.sectionRule} />
          {experience.map(exp => (
            <div key={exp.id} style={s.expItem}>
              <div style={s.expHeader}>
                <div>
                  <div style={s.role}>{exp.role}</div>
                  <div style={s.company}>{exp.company}</div>
                </div>
                <div style={s.dates}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' — ' : ''}{exp.current ? 'Present' : exp.endDate}</div>
              </div>
              {exp.description && <div style={s.desc}>{exp.description}</div>}
              {exp.highlights.length > 0 && (
                <ul style={s.ul}>
                  {exp.highlights.map((h, i) => (
                    <li key={i} style={s.li}><span style={s.bullet}>▸</span>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}>Education</div>
          <div style={s.sectionRule} />
          {education.map(edu => (
            <div key={edu.id} style={s.expItem}>
              <div style={s.expHeader}>
                <div>
                  <div style={s.role}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                  <div style={s.company}>{edu.institution}</div>
                </div>
                <div style={s.dates}>{edu.startDate}{edu.startDate && edu.endDate ? ' — ' : ''}{edu.endDate}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}>Skills</div>
          <div style={s.sectionRule} />
          <div style={s.skillsList}>
            {skills.map(sk => <span key={sk.id} style={s.skillTag}>{sk.name}</span>)}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionTitle}>Projects</div>
          <div style={s.sectionRule} />
          {projects.map(pr => (
            <div key={pr.id} style={s.expItem}>
              <div style={s.role}>{pr.name}{pr.url ? <span style={{ fontWeight: 400, color: theme.muted, fontSize: '0.8rem' }}> · {pr.url}</span> : null}</div>
              {pr.description && <div style={s.desc}>{pr.description}</div>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
