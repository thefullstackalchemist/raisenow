'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './NoticeBanner.module.css';

const STORAGE_KEY = 'raise-notice-dismissed';

export default function NoticeBanner() {
  const { status } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
  }, [status]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.inner}>
        <span className={styles.icon}>🦋</span>
        <p className={styles.text}>
          <strong>Heads up —</strong> RAISE Now is moving to a subscription model soon.
          Want free, unlimited access forever?{' '}
          <a
            href="https://github.com/thefullstackalchemist/raisenow"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Self-host it from our GitHub
          </a>
          {' '}— open source, 5-minute setup, yours to keep.
        </p>
        <button className={styles.closeBtn} onClick={dismiss} aria-label="Dismiss notice">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
