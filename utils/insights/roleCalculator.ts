import { Profile, CustomRole } from '@/lib/types';
import { SKILL_CATEGORIES, ROLE_ARCHETYPES, CAREER_LEVELS, RoleArchetype } from '@/lib/constants/insights';

export interface LocalCategoryScore {
  name:          string;
  score:         number;
  matchedSkills: string[];
}

export interface LocalRoleFit {
  roleId:    string;
  roleName:  string;
  icon:      string;
  color:     string;
  score:     number;
  gapSkills: string[];
}

export interface LocalAnalysis {
  categories:       LocalCategoryScore[];
  roleFits:         LocalRoleFit[];
  yearsExperience:  number;
  level:            string;
  levelColor:       string;
  levelDescription: string;
  overallScore:     number;
}

export function extractAllSkillText(profile: Profile): string[] {
  const terms: string[] = [];
  profile.skills.forEach(s => terms.push(s.name.toLowerCase()));
  profile.experience.forEach(exp => {
    exp.highlights.forEach(h => terms.push(h.toLowerCase()));
    if (exp.role) terms.push(exp.role.toLowerCase());
  });
  return terms;
}

function scoreCategory(terms: string[], keywords: string[]): { score: number; matched: string[] } {
  const matched = keywords.filter(kw => terms.some(t => t.includes(kw)));
  // Score: matched / total keywords, capped at 100, with a minimum floor for partials
  const raw   = matched.length / keywords.length;
  const score = Math.min(100, Math.round(raw * 120)); // slight boost so a decent coverage reads well
  return { score, matched };
}

export function scoreCustomRole(profile: Profile, role: CustomRole): LocalRoleFit {
  const terms = extractAllSkillText(profile);
  const skills = role.coreSkills.map(s => s.trim().toLowerCase()).filter(Boolean);
  const matched = skills.filter(skill => terms.some(t => t.includes(skill)));
  const score = skills.length > 0
    ? Math.min(100, Math.round((matched.length / skills.length) * 100))
    : 0;
  const gapSkills = role.coreSkills.filter(s => !matched.includes(s.trim().toLowerCase())).slice(0, 4);
  return { roleId: role.id, roleName: role.name, icon: role.icon, color: role.color, score, gapSkills };
}

export function calculateYearsExperience(profile: Profile): number {
  const CURRENT = 2026;
  return profile.experience.reduce((total, exp) => {
    const start = parseInt(exp.startDate) || 0;
    const end   = exp.current ? CURRENT : (parseInt(exp.endDate) || 0);
    return total + Math.max(0, end - start);
  }, 0);
}

export function getCareerLevel(years: number) {
  return CAREER_LEVELS.find(l => years >= l.minYears && years < l.maxYears) ?? CAREER_LEVELS[0];
}

export function runLocalAnalysis(profile: Profile): LocalAnalysis {
  const terms = extractAllSkillText(profile);

  const categories: LocalCategoryScore[] = Object.entries(SKILL_CATEGORIES).map(([name, keywords]) => {
    const { score, matched } = scoreCategory(terms, keywords);
    return { name, score, matchedSkills: matched };
  });

  const categoryMap = Object.fromEntries(categories.map(c => [c.name, c.score]));

  const roleFits: LocalRoleFit[] = ROLE_ARCHETYPES.map((role: RoleArchetype) => {
    const entries     = Object.entries(role.requirements);
    const totalWeight = entries.reduce((s, [, w]) => s + w, 0);
    const weighted    = entries.reduce((s, [cat, weight]) => s + (categoryMap[cat] ?? 0) * weight, 0);
    const score       = Math.min(100, Math.round(weighted / totalWeight));

    // Gaps: categories with high requirement but low score
    const gapSkills = entries
      .filter(([cat, weight]) => weight >= 6 && (categoryMap[cat] ?? 0) < 50)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);

    return { roleId: role.id, roleName: role.name, icon: role.icon, color: role.color, score, gapSkills };
  });

  const years      = calculateYearsExperience(profile);
  const levelInfo  = getCareerLevel(years);
  const overallScore = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length);

  return {
    categories,
    roleFits,
    yearsExperience:  years,
    level:            levelInfo.label,
    levelColor:       levelInfo.color,
    levelDescription: levelInfo.description,
    overallScore,
  };
}
