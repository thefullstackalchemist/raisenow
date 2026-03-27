import AccordionPanel from '@/components/Dashboard/AccordionPanel';
import ChatPanel from '@/components/Dashboard/ChatPanel';
import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <AccordionPanel />
      </div>
      <div className={styles.divider} />
      <div className={styles.right}>
        <ChatPanel />
      </div>
    </div>
  );
}
