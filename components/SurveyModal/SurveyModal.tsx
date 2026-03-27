'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './SurveyModal.module.css';

interface Props {
  trigger: 'login' | 'quota_exhausted';
  onClose: () => void;
}

const PRICE_OPTIONS = ['Less than $5', '$5 – $10', '$10 – $20', '$20+', 'I wouldn\'t pay'];

const LIKELIHOOD_LABELS: Record<number, string> = {
  1: 'Not at all',
  2: 'Unlikely',
  3: 'Maybe',
  4: 'Likely',
  5: 'Definitely!',
};

export default function SurveyModal({ trigger, onClose }: Props) {
  const [step, setStep] = useState<'survey' | 'thanks'>('survey');
  const [likelyToBuy, setLikelyToBuy] = useState<number>(0);
  const [priceRange, setPriceRange] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = likelyToBuy > 0 && priceRange !== '';

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger, likelyToBuy, priceRange, feedback }),
    }).catch(() => {});
    setSubmitting(false);
    setStep('thanks');
  };

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>

        {step === 'survey' ? (
          <>
            <div className={styles.header}>
              <Image src="/logo.png" width={36} height={36} alt="RAISE Now" className={styles.logo} />
              <div>
                <div className={styles.title}>
                  {trigger === 'quota_exhausted'
                    ? "You've hit today's limit"
                    : 'Quick question before you dive in'}
                </div>
                <div className={styles.subtitle}>
                  {trigger === 'quota_exhausted'
                    ? "Help us build a Pro plan worth paying for — takes 30 seconds."
                    : "Help us shape RAISE Now Pro — 3 quick questions."}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.body}>
              {/* Q1 — Likelihood */}
              <div className={styles.question}>
                <div className={styles.qLabel}>
                  <span className={styles.qNum}>1</span>
                  How likely are you to pay for a Pro version of RAISE Now?
                </div>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      className={`${styles.star} ${likelyToBuy >= n ? styles.starFilled : ''}`}
                      onClick={() => setLikelyToBuy(n)}
                      aria-label={LIKELIHOOD_LABELS[n]}
                      title={LIKELIHOOD_LABELS[n]}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {likelyToBuy > 0 && (
                  <div className={styles.starLabel}>{LIKELIHOOD_LABELS[likelyToBuy]}</div>
                )}
              </div>

              {/* Q2 — Price */}
              <div className={styles.question}>
                <div className={styles.qLabel}>
                  <span className={styles.qNum}>2</span>
                  What would you pay per month for Pro?
                </div>
                <div className={styles.pills}>
                  {PRICE_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      className={`${styles.pill} ${priceRange === opt ? styles.pillSelected : ''}`}
                      onClick={() => setPriceRange(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 — Feedback */}
              <div className={styles.question}>
                <div className={styles.qLabel}>
                  <span className={styles.qNum}>3</span>
                  What feature would make you upgrade? <span className={styles.optional}>(optional)</span>
                </div>
                <textarea
                  className={styles.textarea}
                  placeholder="e.g. unlimited messages, job-match scoring, cover letter generation…"
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.skipBtn} onClick={onClose}>Skip</button>
              <button
                className={`${styles.submitBtn} ${!canSubmit ? styles.submitDisabled : ''}`}
                disabled={!canSubmit || submitting}
                onClick={submit}
              >
                {submitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.thanks}>
            <div className={styles.thanksIcon}>🦋</div>
            <div className={styles.thanksTitle}>Thank you!</div>
            <div className={styles.thanksText}>
              Your feedback directly shapes what we build next. We appreciate it.
            </div>
            <button className={styles.submitBtn} onClick={onClose}>
              {trigger === 'quota_exhausted' ? 'Got it, see you tomorrow' : 'Let\'s build my resume'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
