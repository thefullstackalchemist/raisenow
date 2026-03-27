'use client';

import { useState } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import CompletenessPanel from './CompletenessPanel';
import styles from './AccordionPanel.module.css';

type Section = 'personal' | 'experience' | 'education' | 'skills' | 'projects';

export default function AccordionPanel() {
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(['personal']));
  const { profile, activeField, updatePersonal, addExperience, updateExperience,
    removeExperience, addEducation, updateEducation, removeEducation,
    addSkill, removeSkill, addProject, updateProject, removeProject } = useProfile();

  const toggle = (section: Section) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const isOpen = (s: Section) => openSections.has(s);
  const isActive = (s: Section) => activeField === s;

return (
    <div className={styles.panel}>
      {/* Profile Completeness — AI-powered gap analysis */}
      <CompletenessPanel />

      {/* Personal Details */}
      <AccordionSection
        label="Personal Details"
        section="personal"
        isOpen={isOpen('personal')}
        isActive={isActive('personal')}
        onToggle={() => toggle('personal')}
        badge={profile.personal.fullName ? undefined : 'Incomplete'}
        icon={<PersonIcon />}
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={profile.personal.fullName}
              onChange={e => updatePersonal('fullName', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={profile.personal.email}
              onChange={e => updatePersonal('email', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={profile.personal.phone}
              onChange={e => updatePersonal('phone', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Location</label>
            <input
              type="text"
              placeholder="San Francisco, CA"
              value={profile.personal.location}
              onChange={e => updatePersonal('location', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>LinkedIn</label>
            <input
              type="url"
              placeholder="linkedin.com/in/alexjohnson"
              value={profile.personal.linkedin}
              onChange={e => updatePersonal('linkedin', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Website</label>
            <input
              type="url"
              placeholder="alexjohnson.dev"
              value={profile.personal.website}
              onChange={e => updatePersonal('website', e.target.value)}
            />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Professional Summary</label>
            <textarea
              placeholder="A brief, compelling summary of your professional identity and goals…"
              value={profile.personal.summary}
              onChange={e => updatePersonal('summary', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </AccordionSection>

      {/* Work Experience */}
      <AccordionSection
        label="Work Experience"
        section="experience"
        isOpen={isOpen('experience')}
        isActive={isActive('experience')}
        onToggle={() => toggle('experience')}
        badge={profile.experience.length > 0 ? `${profile.experience.length}` : undefined}
        icon={<BriefcaseIcon />}
      >
        <div className={styles.itemList}>
          {profile.experience.map((exp, idx) => (
            <div key={exp.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNum}>{idx + 1}</span>
                <button className={styles.removeBtn} onClick={() => removeExperience(exp.id)} title="Remove">
                  <TrashIcon />
                </button>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Company</label>
                  <input type="text" placeholder="Google" value={exp.company}
                    onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Job Title</label>
                  <input type="text" placeholder="Senior Engineer" value={exp.role}
                    onChange={e => updateExperience(exp.id, 'role', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input type="text" placeholder="Jan 2021" value={exp.startDate}
                    onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <input type="text" placeholder="Present" value={exp.endDate} disabled={exp.current}
                    onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" checked={exp.current}
                      onChange={e => updateExperience(exp.id, 'current', e.target.checked)} />
                    Currently working here
                  </label>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Summary <span className={styles.labelHint}>(optional one-liner)</span></label>
                  <input type="text" placeholder="e.g. Full-stack engineer focused on platform reliability"
                    value={exp.description}
                    onChange={e => updateExperience(exp.id, 'description', e.target.value)} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>
                    Key Highlights
                    <span className={styles.labelHint}> — bullet points (filled by AI or type manually)</span>
                  </label>
                  <HighlightsEditor
                    highlights={exp.highlights}
                    onChange={highlights => updateExperience(exp.id, 'highlights', highlights)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button className={styles.addBtn} onClick={addExperience}>
            <PlusIcon /> Add Experience
          </button>
        </div>
      </AccordionSection>

      {/* Education */}
      <AccordionSection
        label="Education"
        section="education"
        isOpen={isOpen('education')}
        isActive={isActive('education')}
        onToggle={() => toggle('education')}
        badge={profile.education.length > 0 ? `${profile.education.length}` : undefined}
        icon={<GradCapIcon />}
      >
        <div className={styles.itemList}>
          {profile.education.map((edu, idx) => (
            <div key={edu.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNum}>{idx + 1}</span>
                <button className={styles.removeBtn} onClick={() => removeEducation(edu.id)} title="Remove">
                  <TrashIcon />
                </button>
              </div>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Institution</label>
                  <input type="text" placeholder="MIT" value={edu.institution}
                    onChange={e => updateEducation(edu.id, 'institution', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Degree</label>
                  <input type="text" placeholder="Bachelor of Science" value={edu.degree}
                    onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Field of Study</label>
                  <input type="text" placeholder="Computer Science" value={edu.field}
                    onChange={e => updateEducation(edu.id, 'field', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Start Year</label>
                  <input type="text" placeholder="2018" value={edu.startDate}
                    onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>End Year</label>
                  <input type="text" placeholder="2022" value={edu.endDate}
                    onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button className={styles.addBtn} onClick={addEducation}>
            <PlusIcon /> Add Education
          </button>
        </div>
      </AccordionSection>

      {/* Skills */}
      <AccordionSection
        label="Skills"
        section="skills"
        isOpen={isOpen('skills')}
        isActive={isActive('skills')}
        onToggle={() => toggle('skills')}
        badge={profile.skills.length > 0 ? `${profile.skills.length}` : undefined}
        icon={<StarIcon />}
      >
        <SkillsEditor />
      </AccordionSection>

      {/* Projects */}
      <AccordionSection
        label="Projects"
        section="projects"
        isOpen={isOpen('projects')}
        isActive={isActive('projects')}
        onToggle={() => toggle('projects')}
        badge={profile.projects.length > 0 ? `${profile.projects.length}` : undefined}
        icon={<FolderIcon />}
      >
        <div className={styles.itemList}>
          {profile.projects.map((proj, idx) => (
            <div key={proj.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNum}>{idx + 1}</span>
                <button className={styles.removeBtn} onClick={() => removeProject(proj.id)} title="Remove">
                  <TrashIcon />
                </button>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Project Name</label>
                  <input type="text" placeholder="My Awesome App" value={proj.name}
                    onChange={e => updateProject(proj.id, 'name', e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>URL (optional)</label>
                  <input type="url" placeholder="github.com/user/project" value={proj.url || ''}
                    onChange={e => updateProject(proj.id, 'url', e.target.value)} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Description</label>
                  <textarea placeholder="What did you build and what impact did it have?" value={proj.description}
                    onChange={e => updateProject(proj.id, 'description', e.target.value)} rows={2} />
                </div>
              </div>
            </div>
          ))}
          <button className={styles.addBtn} onClick={addProject}>
            <PlusIcon /> Add Project
          </button>
        </div>
      </AccordionSection>
    </div>
  );
}

/* ── Highlights Editor ─────────────────────────────────────────── */
function HighlightsEditor({
  highlights,
  onChange,
}: {
  highlights: string[];
  onChange: (highlights: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...highlights, trimmed]);
    setInput('');
  };

  const update = (idx: number, val: string) => {
    const next = [...highlights];
    next[idx] = val;
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(highlights.filter((_, i) => i !== idx));
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
  };

  return (
    <div className={styles.highlightsEditor}>
      {highlights.map((h, idx) => (
        <div key={idx} className={styles.highlightRow}>
          <span className={styles.bulletDot}>▸</span>
          <input
            type="text"
            value={h}
            onChange={e => update(idx, e.target.value)}
            placeholder="Led / Built / Reduced / Increased…"
            className={styles.highlightInput}
          />
          <button className={styles.removeHighlight} onClick={() => remove(idx)} title="Remove">×</button>
        </div>
      ))}
      <div className={styles.highlightAdd}>
        <span className={styles.bulletDot} style={{ opacity: 0.35 }}>▸</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add a bullet point and press Enter…"
          className={styles.highlightInput}
        />
        <button className={styles.addHighlightBtn} onClick={add} disabled={!input.trim()}>+</button>
      </div>
      {highlights.length === 0 && (
        <p className={styles.highlightHint}>
          Chat with RAISE — it will auto-generate bullet points as you describe your work.
        </p>
      )}
    </div>
  );
}

/* ── Skills Editor ──────────────────────────────────────────────── */
function SkillsEditor() {
  const { profile, addSkill, removeSkill } = useProfile();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    parts.forEach(s => addSkill(s));
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
  };

  return (
    <div className={styles.skillsEditor}>
      <div className={styles.skillsInput}>
        <input
          type="text"
          placeholder="Type a skill and press Enter (e.g. React, TypeScript)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className={styles.addSmallBtn} onClick={handleAdd}>Add</button>
      </div>
      <div className={styles.skillChips}>
        {profile.skills.map(skill => (
          <span key={skill.id} className={styles.chip}>
            {skill.name}
            <button onClick={() => removeSkill(skill.id)} aria-label="Remove skill">×</button>
          </span>
        ))}
        {profile.skills.length === 0 && (
          <span className={styles.emptyHint}>No skills added yet — type above to add</span>
        )}
      </div>
    </div>
  );
}

/* ── Accordion Section ──────────────────────────────────────────── */
function AccordionSection({
  label, section, isOpen, isActive, onToggle, badge, icon, children,
}: {
  label: string;
  section: Section;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  badge?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.section} ${isActive ? styles.highlighted : ''}`}>
      <button className={`${styles.sectionHeader} ${isOpen ? styles.open : ''}`} onClick={onToggle}>
        <span className={styles.sectionIcon}>{icon}</span>
        <span className={styles.sectionLabel}>{label}</span>
        {badge && <span className={styles.badge}>{badge}</span>}
        <span className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`}>
          <ChevronIcon />
        </span>
      </button>
      {isOpen && (
        <div className={styles.sectionBody}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Inline Icons ──────────────────────────────────────────────── */
const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const GradCapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);
const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
