'use client';

import { useState } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import styles from './JobDescPanel.module.css';

interface Analysis {
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  score: number;
}

export default function JobDescPanel() {
  const { profile } = useProfile();
  const [jobDesc, setJobDesc] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!jobDesc.trim()) return;
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDesc, profile }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch {
      setAnalysis({
        matchedSkills: [],
        missingSkills: [],
        suggestions: ['Could not analyze. Please try again.'],
        score: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const hasProfile = profile.personal.fullName || profile.experience.length > 0;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Job Description</h2>
        <p className={styles.subtitle}>Paste a job posting to tailor your resume and get a match analysis</p>
      </div>

      {!hasProfile && (
        <div className={styles.notice}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Build your profile on the Dashboard first for better results
        </div>
      )}

      <div className={styles.body}>
        <textarea
          className={styles.jobInput}
          placeholder="Paste the full job description here…&#10;&#10;e.g. We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and cloud infrastructure..."
          value={jobDesc}
          onChange={e => setJobDesc(e.target.value)}
          rows={12}
        />

        <button
          className={`${styles.analyzeBtn} ${(!jobDesc.trim() || loading) ? styles.disabled : ''}`}
          onClick={analyze}
          disabled={!jobDesc.trim() || loading}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
              Analyzing…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Analyze & Match
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className={styles.results}>
          {/* Score */}
          <div className={styles.scoreCard}>
            <div className={styles.scoreCircle}>
              <svg viewBox="0 0 36 36" className={styles.scoreRing}>
                <path className={styles.scoreTrack} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={styles.scoreFill} strokeDasharray={`${analysis.score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className={styles.scorePct}>{analysis.score}%</div>
            </div>
            <div>
              <div className={styles.scoreLabel}>Resume Match Score</div>
              <div className={styles.scoreHint}>
                {analysis.score >= 70 ? 'Strong match!' : analysis.score >= 40 ? 'Good starting point' : 'Needs work'}
              </div>
            </div>
          </div>

          {/* Matched */}
          {analysis.matchedSkills.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupLabel}>
                <span className={styles.dot} style={{ background: '#22C55E' }} />
                Matched Skills ({analysis.matchedSkills.length})
              </div>
              <div className={styles.chips}>
                {analysis.matchedSkills.map(s => (
                  <span key={s} className={`${styles.chip} ${styles.matched}`}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing */}
          {analysis.missingSkills.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupLabel}>
                <span className={styles.dot} style={{ background: '#F59E0B' }} />
                Skills to Add ({analysis.missingSkills.length})
              </div>
              <div className={styles.chips}>
                {analysis.missingSkills.map(s => (
                  <span key={s} className={`${styles.chip} ${styles.missing}`}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupLabel}>
                <span className={styles.dot} style={{ background: '#6366F1' }} />
                Tailoring Tips
              </div>
              <ul className={styles.tips}>
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
