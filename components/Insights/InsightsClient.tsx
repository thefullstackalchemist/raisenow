'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import { runLocalAnalysis, scoreCustomRole } from '@/utils/insights/roleCalculator';
import { fetchLatestSnapshot, generateSnapshot, SnapshotData } from '@/services/insightsApiService';
import { ROLE_ARCHETYPES } from '@/lib/constants/insights';
import { RoleInfo } from './GapCard';
import SummaryCard from './SummaryCard';
import RoleFitRadar from './RoleFitRadar';
import SkillBreakdownBar from './SkillBreakdownBar';
import GapCard from './GapCard';
import TargetRoleManager from './TargetRoleManager';
import styles from './InsightsClient.module.css';

export default function InsightsClient() {
  const { profile, dataLoaded, targetRoleIds, customRoles } = useProfile();
  const [snapshot, setSnapshot]     = useState<SnapshotData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [lastRun, setLastRun]       = useState<Date | null>(null);

  // Compute local analysis instantly
  const local = dataLoaded ? runLocalAnalysis(profile) : null;

  // Load stored snapshot on mount
  useEffect(() => {
    if (!dataLoaded) return;
    fetchLatestSnapshot().then(data => {
      if (data) {
        setSnapshot(data);
        setLastRun(data.generatedAt ? new Date(data.generatedAt) : null);
      }
    });
  }, [dataLoaded]);

  const handleGenerate = async () => {
    setGenerating(true);
    const data = await generateSnapshot(profile, customRoles);
    if (data) {
      setSnapshot(data);
      setLastRun(new Date());
    }
    setGenerating(false);
  };

  if (!dataLoaded || !local) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <span>Loading your profile…</span>
      </div>
    );
  }

  const hasEnoughData = profile.skills.length > 0 || profile.experience.length > 0;

  // Determine which built-in archetypes to show in gap cards
  const activeArchetypes = targetRoleIds.length > 0
    ? ROLE_ARCHETYPES.filter(r => targetRoleIds.includes(r.id))
    : ROLE_ARCHETYPES;

  // Local fits for custom roles
  const customLocalFits = customRoles.map(cr => scoreCustomRole(profile, cr));

  // Radar data — selected built-in roles only (custom roles have no category weights)
  const radarData = activeArchetypes.map(r => {
    const aiFit    = snapshot?.roleFits?.find(f => f.roleId === r.id);
    const localFit = local.roleFits.find(f => f.roleId === r.id);
    return {
      role:     r.name.replace(' Developer', '').replace(' Engineer', ''),
      fullName: r.name,
      score:    aiFit?.score ?? localFit?.score ?? 0,
    };
  });

  // Bar data — skill category breakdown
  const barData = local.categories.map(c => {
    const aiCat = snapshot?.categories?.find(ac => ac.name === c.name);
    return { category: c.name, score: aiCat?.score ?? c.score };
  });

  const overallScore = snapshot?.overallScore ?? local.overallScore;
  const level        = snapshot?.level        ?? local.level;
  const levelColor   = local.levelColor;
  const years        = snapshot?.yearsExperience ?? local.yearsExperience;
  const topStrength  = snapshot?.topStrengths?.[0]
    ?? [...local.categories].sort((a, b) => b.score - a.score)[0]?.name
    ?? '—';

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.pageTitle}>Career Intelligence</div>
          <div className={styles.pageSub}>Skills analysis based on your work history and listed skills</div>
          {lastRun && (
            <div className={styles.lastAnalysed}>
              Last AI analysis: {lastRun.toLocaleDateString()} {lastRun.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
        <div>
          <button
            className={styles.refreshBtn}
            onClick={handleGenerate}
            disabled={generating || !hasEnoughData}
          >
            {generating ? (
              <><span className={styles.spinnerSmall} />Analysing…</>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 4v6h-6"/>
                  <path d="M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                {snapshot ? 'Re-analyse with AI' : 'Analyse with AI'}
              </>
            )}
          </button>
          {!snapshot && <div className={styles.aiNote}>Local analysis shown — click to run AI deep-dive</div>}
        </div>
      </div>

      {!hasEnoughData ? (
        <div className={styles.emptyWrap}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Add skills and experience first</div>
          <div>Head to the Dashboard and fill in your work history and skills to unlock Career Intelligence.</div>
        </div>
      ) : (
        <>
          {/* Target Role Manager */}
          <TargetRoleManager />

          {/* Summary Row */}
          <div className={styles.summaryRow}>
            <SummaryCard
              label="Overall Score"
              value={`${overallScore}%`}
              sub={`${local.categories.filter(c => c.score > 50).length} of ${local.categories.length} categories strong`}
              accent="#2563EB"
            />
            <SummaryCard
              label="Career Level"
              value={level.charAt(0).toUpperCase() + level.slice(1)}
              sub={`~${years} year${years !== 1 ? 's' : ''} of experience`}
              accent={levelColor}
            />
            <SummaryCard
              label="Top Strength"
              value={topStrength}
              sub={snapshot?.topStrengths?.slice(1).join(', ') || 'Based on skills & highlights'}
              accent="#059669"
            />
          </div>

          {/* Charts */}
          {radarData.length > 0 && (
            <div className={styles.chartsRow}>
              <div className={styles.chartPanel}>
                <div className={styles.chartTitle}>Role Fit Overview</div>
                <RoleFitRadar data={radarData} primaryColor="#2563EB" />
              </div>
              <div className={styles.chartPanel}>
                <div className={styles.chartTitle}>Skill Category Scores</div>
                <SkillBreakdownBar data={barData} primaryColor="#2563EB" />
              </div>
            </div>
          )}

          {/* AI Summary */}
          {snapshot?.summary && (
            <div className={styles.aiSummary}>{snapshot.summary}</div>
          )}

          {/* Strengths & Gaps */}
          {snapshot && (snapshot.topStrengths?.length > 0 || snapshot.topGaps?.length > 0) && (
            <div className={styles.insightRow}>
              {snapshot.topStrengths?.length > 0 && (
                <div className={styles.insightPanel}>
                  <div className={styles.insightTitle}>Top Strengths</div>
                  <div className={styles.insightList}>
                    {snapshot.topStrengths.map(s => (
                      <div key={s} className={styles.insightItem}>
                        <span className={styles.strengthDot} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {snapshot.topGaps?.length > 0 && (
                <div className={styles.insightPanel}>
                  <div className={styles.insightTitle}>Priority Learning Areas</div>
                  <div className={styles.insightList}>
                    {snapshot.topGaps.map(g => (
                      <div key={g} className={styles.insightItem}>
                        <span className={styles.gapDot} />
                        {g}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gap Analysis per Role */}
          <div className={styles.gapsSection}>
            <div className={styles.gapsTitle}>
              Gap Analysis by Role
              {(targetRoleIds.length > 0 || customRoles.length > 0) && activeArchetypes.length < ROLE_ARCHETYPES.length && (
                <span className={styles.gapsFilter}> · {activeArchetypes.length + customRoles.length} selected</span>
              )}
            </div>
            <div className={styles.gapsGrid}>
              {/* Built-in archetypes (filtered by selection) */}
              {activeArchetypes.map(archetype => {
                const localFit = local.roleFits.find(f => f.roleId === archetype.id)!;
                const aiFit    = snapshot?.roleFits?.find(f => f.roleId === archetype.id);
                const role: RoleInfo = {
                  id:          archetype.id,
                  name:        archetype.name,
                  icon:        archetype.icon,
                  description: archetype.description,
                  color:       archetype.color,
                  coreSkills:  archetype.coreSkills,
                };
                return (
                  <GapCard key={archetype.id} role={role} localFit={localFit} aiFit={aiFit} />
                );
              })}

              {/* Custom roles */}
              {customRoles.map((cr, i) => {
                const localFit  = customLocalFits[i];
                const aiFit     = snapshot?.roleFits?.find(f => f.roleId === cr.id);
                const role: RoleInfo = {
                  id:          cr.id,
                  name:        cr.name,
                  icon:        cr.icon,
                  description: cr.description,
                  color:       cr.color,
                  coreSkills:  cr.coreSkills,
                  isCustom:    true,
                };
                return (
                  <GapCard key={cr.id} role={role} localFit={localFit} aiFit={aiFit} />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
