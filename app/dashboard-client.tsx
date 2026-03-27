'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AccordionPanel from '@/components/Dashboard/AccordionPanel';
import ChatPanel from '@/components/Dashboard/ChatPanel';
import SurveyModal from '@/components/SurveyModal/SurveyModal';
import styles from './page.module.css';

const SESSION_KEY = 'raise-survey-shown';

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyTrigger, setSurveyTrigger] = useState<'login' | 'quota_exhausted'>('login');

  // Show once per browser session after login
  useEffect(() => {
    if (status !== 'authenticated') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    // Small delay so the page finishes rendering first
    const t = setTimeout(() => {
      setSurveyTrigger('login');
      setSurveyOpen(true);
    }, 1200);
    return () => clearTimeout(t);
  }, [status]);

  const handleQuotaExhausted = () => {
    setSurveyTrigger('quota_exhausted');
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
          trigger={surveyTrigger}
          onClose={() => setSurveyOpen(false)}
        />
      )}
    </div>
  );
}
