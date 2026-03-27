import styles from './InsightsClient.module.css';

interface Props {
  label:   string;
  value:   string;
  sub?:    string;
  accent?: string;
  icon?:   React.ReactNode;
}

export default function SummaryCard({ label, value, sub, accent, icon }: Props) {
  return (
    <div className={styles.summaryCard}>
      {icon && <div className={styles.summaryIcon} style={{ color: accent }}>{icon}</div>}
      <div className={styles.summaryContent}>
        <div className={styles.summaryLabel}>{label}</div>
        <div className={styles.summaryValue} style={accent ? { color: accent } : undefined}>{value}</div>
        {sub && <div className={styles.summarySub}>{sub}</div>}
      </div>
    </div>
  );
}
