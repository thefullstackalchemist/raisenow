'use client';

import Image from 'next/image';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from './login.module.css';

export default function LoginClient() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const res = await signIn('credentials', {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    setLoginLoading(false);

    if (res?.ok) {
      window.location.href = '/';
    } else {
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match');
      return;
    }

    setRegLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
    });

    const data = await res.json();
    setRegLoading(false);

    if (res.ok) {
      setRegSuccess('Account created! Signing you in…');
      await signIn('credentials', {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });
      window.location.href = '/';
    } else {
      setRegError(data.error || 'Registration failed');
    }
  };

  return (
    <div className={styles.page}>
      {/* Background decoration */}
      <div className={styles.bgDecor}>
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
      </div>

      {/* Card */}
      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <Image src="/logo.png" width={44} height={44} alt="RAISE Now" className={styles.brandIcon} />
          <div>
            <div className={styles.brandName}>RAISE Now</div>
            <div className={styles.brandTagline}>Resume Analysis Is Super Easy Now</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.activeTab : ''}`}
            onClick={() => { setTab('login'); setLoginError(''); }}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.activeTab : ''}`}
            onClick={() => { setTab('register'); setRegError(''); setRegSuccess(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.formHeader}>
              <h2>Welcome back</h2>
              <p>Sign in to continue building your resume</p>
            </div>

            <div className={styles.field}>
              <label>Email address</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {loginError && (
              <div className={styles.error}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {loginError}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loginLoading}>
              {loginLoading ? <span className={styles.spinner} /> : null}
              {loginLoading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className={styles.switchHint}>
              Don&apos;t have an account?{' '}
              <button type="button" className={styles.switchLink} onClick={() => setTab('register')}>
                Create one free
              </button>
            </p>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.formHeader}>
              <h2>Create your account</h2>
              <p>Start building a resume that stands out</p>
            </div>

            <div className={styles.field}>
              <label>Full Name</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Email address</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Confirm Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {regError && (
              <div className={styles.error}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {regError}
              </div>
            )}

            {regSuccess && (
              <div className={styles.success}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                {regSuccess}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={regLoading}>
              {regLoading ? <span className={styles.spinner} /> : null}
              {regLoading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className={styles.switchHint}>
              Already have an account?{' '}
              <button type="button" className={styles.switchLink} onClick={() => setTab('login')}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>

      {/* Footer tagline */}
      <p className={styles.footer}>
        Your resume data is private and securely stored.
      </p>
    </div>
  );
}
