'use client';

import { useState } from 'react';
import AccordionPanel from '@/components/Dashboard/AccordionPanel';
import ChatPanel from '@/components/Dashboard/ChatPanel';
import SurveyModal from '@/components/SurveyModal/SurveyModal';
import styles from './page.module.css';

export default function DashboardClient() {
  const [surveyOpen, setSurveyOpen] = useState(false);

  const handleQuotaExhausted = () => {
    setSurveyOpen(true);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <AccordionPanel />
      </div>
      <div className={styles.divider} />
      <div className={styles.right}>
        <ChatPanel onQuotaExhausted={handleQuotaExhausted} />
      </div>

      {surveyOpen && (
        <SurveyModal
          trigger="quota_exhausted"
          onClose={() => setSurveyOpen(false)}
        />
      )}
    </div>
  );
}
