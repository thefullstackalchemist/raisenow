import { Profile } from '@/lib/types';
import { CURRENT_YEAR } from './constants';

export interface Gap {
  id:       string;
  label:    string;
  trigger:  string;
  category: 'experience' | 'education' | 'personal' | 'skills' | 'projects';
  priority: 'high' | 'medium' | 'low';
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function detectLocalGaps(profile: Profile): Gap[] {
  const gaps: Gap[] = [];
  const p = profile.personal;

  // ── Personal ────────────────────────────────────────────────────
  if (!p.fullName?.trim())
    gaps.push({ id: 'no-name', label: 'Full name missing', priority: 'high', category: 'personal',
      trigger: "I haven't added my name yet — let me introduce myself and fill in my personal details" });
  if (!p.email?.trim())
    gaps.push({ id: 'no-email', label: 'Email not added', priority: 'high', category: 'personal',
      trigger: "I haven't added my email address yet — let me add my contact details" });
  if (!p.phone?.trim())
    gaps.push({ id: 'no-phone', label: 'Phone number missing', priority: 'medium', category: 'personal',
      trigger: "My phone number is missing from my profile — let me add my contact details" });
  if (!p.location?.trim())
    gaps.push({ id: 'no-location', label: 'Location not set', priority: 'low', category: 'personal',
      trigger: "I haven't set my location yet — let me add where I'm based" });
  if (!p.summary?.trim())
    gaps.push({ id: 'no-summary', label: 'Professional summary missing', priority: 'high', category: 'personal',
      trigger: "I don't have a professional summary yet — help me write a compelling 2-3 line summary for my resume" });
  if (!p.linkedin?.trim())
    gaps.push({ id: 'no-linkedin', label: 'LinkedIn not added', priority: 'low', category: 'personal',
      trigger: "I haven't added my LinkedIn profile URL yet — let me add that to my contact details" });

  // ── Education ────────────────────────────────────────────────────
  if (profile.education.length === 0) {
    gaps.push({ id: 'no-education', label: 'No education added', priority: 'high', category: 'education',
      trigger: "I haven't added any education yet — let me tell you about my studies and qualifications" });
  } else {
    profile.education.forEach(edu => {
      if (!edu.degree?.trim() || !edu.field?.trim())
        gaps.push({ id: `edu-incomplete-${edu.id}`, label: `Incomplete: ${edu.institution || 'education entry'}`,
          priority: 'medium', category: 'education',
          trigger: `My education entry at ${edu.institution || 'one of my schools'} is missing the degree or field details — let me fill that in` });
    });
  }

  // ── Experience ───────────────────────────────────────────────────
  if (profile.experience.length === 0) {
    gaps.push({ id: 'no-experience', label: 'No work experience added', priority: 'high', category: 'experience',
      trigger: "I haven't added any work experience yet — let me walk you through my career history from the beginning" });
  } else {
    profile.experience.forEach(exp => {
      const name = exp.company || 'a company';
      if (exp.highlights.length === 0)
        gaps.push({ id: `no-highlights-${exp.id}`, label: `No bullet points: ${name}`, priority: 'high', category: 'experience',
          trigger: `My role at ${name} has no bullet points yet — let me describe what I did there so we can build strong highlights` });
      else if (exp.highlights.length < 3)
        gaps.push({ id: `weak-highlights-${exp.id}`,
          label: `Only ${exp.highlights.length} bullet${exp.highlights.length > 1 ? 's' : ''}: ${name}`,
          priority: 'medium', category: 'experience',
          trigger: `I only have ${exp.highlights.length} bullet point${exp.highlights.length > 1 ? 's' : ''} for my role at ${name} — let's strengthen that section with more achievements` });
    });

    const eduEndYears   = profile.education.map(e => parseInt(e.endDate)).filter(y => !isNaN(y));
    const latestEduEnd  = eduEndYears.length  > 0 ? Math.max(...eduEndYears)  : null;
    const expStartYears = profile.experience.map(e => parseInt(e.startDate)).filter(y => !isNaN(y));
    const earliestExpStart = expStartYears.length > 0 ? Math.min(...expStartYears) : null;

    if (latestEduEnd && earliestExpStart && earliestExpStart - latestEduEnd > 1) {
      const gapYears = earliestExpStart - latestEduEnd;
      gaps.push({ id: 'edu-work-gap',
        label: `${gapYears}-year gap: ${latestEduEnd}–${earliestExpStart}`, priority: 'high', category: 'experience',
        trigger: `There's a ${gapYears}-year gap between when I finished my education in ${latestEduEnd} and my first listed job in ${earliestExpStart} — let me tell you what I was doing during those years` });
    }

    const sorted = [...profile.experience]
      .filter(e => e.startDate && (e.endDate || e.current))
      .sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate));
    for (let i = 0; i < sorted.length - 1; i++) {
      const curr    = sorted[i];
      const next    = sorted[i + 1];
      const currEnd = curr.current ? CURRENT_YEAR : parseInt(curr.endDate);
      const nextStart = parseInt(next.startDate);
      if (!isNaN(currEnd) && !isNaN(nextStart) && nextStart - currEnd > 1)
        gaps.push({ id: `career-gap-${i}`,
          label: `${nextStart - currEnd}-year gap after ${curr.company || 'previous role'}`,
          priority: 'medium', category: 'experience',
          trigger: `There's a ${nextStart - currEnd}-year gap between my time at ${curr.company || 'one company'} and ${next.company || 'the next role'} — let me explain what I was doing from ${currEnd} to ${nextStart}` });
    }

    const expEndYears  = profile.experience.filter(e => !e.current).map(e => parseInt(e.endDate)).filter(y => !isNaN(y));
    const latestExpEnd = expEndYears.length > 0 ? Math.max(...expEndYears) : null;
    const hasCurrentJob = profile.experience.some(e => e.current);
    if (latestEduEnd && !hasCurrentJob && latestExpEnd && CURRENT_YEAR - latestExpEnd > 1)
      gaps.push({ id: 'recent-gap',
        label: `${CURRENT_YEAR - latestExpEnd} years since last role (${latestExpEnd})`,
        priority: 'high', category: 'experience',
        trigger: `It looks like my most recent listed job ended in ${latestExpEnd} — that's about ${CURRENT_YEAR - latestExpEnd} years ago. Let me tell you what I've been doing since then` });

    if (latestEduEnd) {
      const totalCareerSpan = CURRENT_YEAR - latestEduEnd;
      const coveredYears    = profile.experience.reduce((acc, e) => {
        const start = parseInt(e.startDate) || 0;
        const end   = e.current ? CURRENT_YEAR : (parseInt(e.endDate) || 0);
        return acc + Math.max(0, end - start);
      }, 0);
      const uncovered = totalCareerSpan - coveredYears;
      if (uncovered > 2 && !gaps.find(g => g.id === 'edu-work-gap'))
        gaps.push({ id: 'career-coverage',
          label: `~${uncovered} career years unaccounted`, priority: 'high', category: 'experience',
          trigger: `Looking at my career from ${latestEduEnd} to now, there are about ${uncovered} years of work history I haven't described yet — let me walk you through my full career` });
    }
  }

  // ── Skills ───────────────────────────────────────────────────────
  if (profile.skills.length === 0)
    gaps.push({ id: 'no-skills', label: 'No skills listed', priority: 'high', category: 'skills',
      trigger: "I haven't listed any skills yet — let me tell you about the technologies and tools I know" });
  else if (profile.skills.length < 5)
    gaps.push({ id: 'few-skills', label: `Only ${profile.skills.length} skill${profile.skills.length > 1 ? 's' : ''} listed`,
      priority: 'medium', category: 'skills',
      trigger: `I only have ${profile.skills.length} skill${profile.skills.length > 1 ? 's' : ''} listed — let's make sure we capture everything I know across all my roles` });

  return gaps.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

export function computeScore(profile: Profile): number {
  const p = profile.personal;
  let filled = 0;
  if (p.fullName)  filled++;
  if (p.email)     filled++;
  if (p.phone)     filled++;
  if (p.location)  filled++;
  if (p.summary)   filled++;
  if (profile.experience.length > 0)                           filled++;
  if (profile.experience.some(e => e.highlights.length >= 3)) filled++;
  if (profile.education.length > 0)                           filled++;
  if (profile.skills.length >= 5)                             filled++;
  if (detectLocalGaps(profile).filter(g => g.priority === 'high').length === 0) filled++;
  return Math.round((filled / 10) * 100);
}
