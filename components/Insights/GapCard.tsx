import styles from './InsightsClient.module.css';

export interface RoleInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  coreSkills: string[];
  isCustom?: boolean;
}

interface LocalFit {
  roleId:    string;
  roleName:  string;
  icon:      string;
  color:     string;
  score:     number;
  gapSkills: string[];
}

interface AIFit {
  roleId:         string;
  score:          number;
  gapSkills:      string[];
  recommendation: string;
}

interface Props {
  role:      RoleInfo;
  localFit:  LocalFit;
  aiFit?:    AIFit;
}

function scoreClass(score: number) {
  if (score >= 75) return 'scoreHigh';
  if (score >= 50) return 'scoreMid';
  return 'scoreLow';
}

export default function GapCard({ role, localFit, aiFit }: Props) {
  const score = aiFit?.score ?? localFit.score;
  const gaps  = aiFit?.gapSkills?.length ? aiFit.gapSkills : localFit.gapSkills;
  const reco  = aiFit?.recommendation;

  return (
    <div className={styles.gapCard}>
      <div className={styles.gapCardHeader}>
        <span className={styles.gapIcon}>{role.icon}</span>
        <div className={styles.gapTitleGroup}>
          <div className={styles.gapTitle}>
            {role.name}
            {role.isCustom && <span className={styles.customBadge}>Custom</span>}
          </div>
          <div className={styles.gapDesc}>{role.description}</div>
        </div>
        <div className={`${styles.gapScore} ${styles[scoreClass(score)]}`}>{score}%</div>
      </div>

      <div className={styles.gapProgress}>
        <div className={styles.gapProgressBar} style={{ width: `${score}%`, background: role.color }} />
      </div>

      {gaps.length > 0 && (
        <div className={styles.gapMissing}>
          <div className={styles.gapMissingLabel}>Key gaps</div>
          <div className={styles.gapChips}>
            {gaps.map(g => <span key={g} className={styles.gapChip}>{g}</span>)}
          </div>
        </div>
      )}

      {reco && <div className={styles.gapReco}>{reco}</div>}

      {role.coreSkills.length > 0 && (
        <div className={styles.gapCore}>
          <span className={styles.gapCoreLabel}>Core skills:</span>
          {role.coreSkills.join(' · ')}
        </div>
      )}
    </div>
  );
}
