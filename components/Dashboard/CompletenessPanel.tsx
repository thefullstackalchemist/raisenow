'use client';

import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import { Profile } from '@/lib/types';
import styles from './CompletenessPanel.module.css';
import { Gap, detectLocalGaps, computeScore } from '@/utils/resume/scoring';
import { CATEGORY_ICONS, PRIORITY_COLORS } from '@/utils/resume/constants';
import { fetchAIGaps } from '@/services/completenessApiService';

/* ─── Component ──────────────────────────────────────────────────── */
export default function CompletenessPanel() {
  const { profile, dataLoaded, setPendingTrigger } = useProfile();
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [score, setScore] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const initialised = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSnapshot = useRef('');

  const refresh = (p: Profile) => {
    // 1. Always show local gaps immediately
    const local = detectLocalGaps(p);
    setGaps(local);
    setScore(computeScore(p));

    // 2. If profile has any real data, also ask AI for nuanced gaps
    const hasData = p.personal.fullName || p.experience.length > 0 || p.education.length > 0;
    if (!hasData) return;

    // Build a sanitized payload — personal fields as boolean flags (no raw PII sent),
    // experience as company/role/dates only, education as institution/degree/dates only.
    const sanitized = {
      personal: {
        hasFullName:  /\S+\s+\S+/.test(p.personal.fullName ?? ''),
        hasEmail:     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.personal.email ?? ''),
        hasPhone:     /[\d\s\-\+\(\)]{7,}/.test(p.personal.phone ?? ''),
        hasLocation:  (p.personal.location ?? '').trim().length > 0,
        hasSummary:   (p.personal.summary ?? '').trim().length > 20,
        hasLinkedin:  (p.personal.linkedin ?? '').trim().length > 0,
      },
      experience: p.experience.map(e => ({
        company:   e.company,
        role:      e.role,
        startDate: e.startDate,
        endDate:   e.endDate,
        current:   e.current,
      })),
      education: p.education.map(e => ({
        institution: e.institution,
        degree:      e.degree,
        field:       e.field,
        startDate:   e.startDate,
        endDate:     e.endDate,
      })),
      skillsCount:   p.skills.length,
      projectsCount: p.projects.length,
    };

    setAiLoading(true);
    fetchAIGaps(sanitized)
      .then(aiGaps => {
        // Merge AI gaps — only add ones with IDs not already in local list
        setGaps(prev => {
          const existingIds = new Set(prev.map(g => g.id));
          const newFromAI = aiGaps.filter(g => !existingIds.has(g.id));
          const merged = [...prev, ...newFromAI];
          const order = { high: 0, medium: 1, low: 2 };
          return merged.sort((a, b) => order[a.priority] - order[b.priority]);
        });
        setScore(computeScore(p));
      })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  };

  // Run on initial data load
  useEffect(() => {
    if (!dataLoaded || initialised.current) return;
    initialised.current = true;
    refresh(profile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded]);

  // Re-run (debounced 2.5s) when profile meaningfully changes
  useEffect(() => {
    if (!initialised.current) return;
    const snapshot = JSON.stringify({
      name: profile.personal.fullName,
      email: profile.personal.email,
      phone: profile.personal.phone,
      location: profile.personal.location,
      summary: !!profile.personal.summary,
      linkedin: !!profile.personal.linkedin,
      expCount: profile.experience.length,
      eduCount: profile.education.length,
      skillCount: profile.skills.length,
      highlights: profile.experience.map(e => e.highlights.length),
      expDates: profile.experience.map(e => `${e.startDate}-${e.endDate}-${e.current}`),
      eduDates: profile.education.map(e => `${e.startDate}-${e.endDate}`),
    });
    if (snapshot === prevSnapshot.current) return;
    prevSnapshot.current = snapshot;

    // Update score + local gaps immediately
    setGaps(detectLocalGaps(profile));
    setScore(computeScore(profile));

    // Debounce the AI call
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => refresh(profile), 2500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const highCount = gaps.filter(g => g.priority === 'high').length;
  const isLoading = aiLoading && gaps.length === 0;
  // "complete" only when both local AND AI find nothing
  const isComplete = dataLoaded && !isLoading && gaps.length === 0;

  return (
    <div className={styles.panel}>
      {/* Header */}
      <button className={styles.header} onClick={() => setExpanded(e => !e)}>
        <div className={styles.headerLeft}>
          <div className={styles.scoreRingWrap}>
            <svg viewBox="0 0 36 36" className={styles.ring}>
              <path className={styles.ringTrack}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className={styles.ringFill}
                strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className={styles.ringPct}>{score}%</span>
          </div>
          <div>
            <div className={styles.title}>Profile Completeness</div>
            <div className={styles.subtitle}>
              {isLoading && <><span className={styles.spinner} style={{ width: 8, height: 8, borderWidth: 1.5, marginRight: 4 }} />Analysing…</>}
              {!isLoading && gaps.length > 0 && highCount > 0 &&
                <><span className={styles.highDot} />{highCount} critical · {gaps.length} total to fix</>}
              {!isLoading && gaps.length > 0 && highCount === 0 &&
                <><span className={styles.medDot} />{gaps.length} item{gaps.length > 1 ? 's' : ''} to improve</>}
              {isComplete && <><span className={styles.okDot} />All clear — profile complete!</>}
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          {aiLoading && <span className={styles.spinner} />}
          <span className={`${styles.chevron} ${expanded ? styles.chevronUp : ''}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </span>
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className={styles.body}>
          {isLoading && (
            <div className={styles.loadingGaps}>
              {[82, 67, 74, 58].map((w, i) => (
                <div key={i} className={styles.skeletonGap} style={{ width: `${w}%` }} />
              ))}
            </div>
          )}

          {isComplete && (
            <div className={styles.empty}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              All sections complete — your profile is ready to generate a resume!
            </div>
          )}

          {!isLoading && gaps.map(gap => (
            <button key={gap.id} className={styles.gapCard}
              onClick={() => setPendingTrigger(gap.trigger)}
              title="Click to discuss this with RAISE">
              <div className={styles.gapLeft}>
                <span className={styles.priorityBar} style={{ background: PRIORITY_COLORS[gap.priority] }} />
                <span className={styles.catIcon}>{CATEGORY_ICONS[gap.category]}</span>
                <span className={styles.gapLabel}>{gap.label}</span>
              </div>
              <div className={styles.gapRight}>
                <span className={styles.chatHint}>Ask AI</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}

          {!isLoading && gaps.length > 0 && (
            <button className={styles.refreshBtn} onClick={() => refresh(profile)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Re-analyse
            </button>
          )}
        </div>
      )}
    </div>
  );
}
