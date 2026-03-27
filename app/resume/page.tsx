import ResumePreview from '@/components/Resume/ResumePreview';
import JobDescPanel from '@/components/Resume/JobDescPanel';
import styles from './page.module.css';

export default function ResumePage() {
  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <ResumePreview />
      </div>
      <div className={styles.right}>
        <JobDescPanel />
      </div>
    </div>
  );
}
