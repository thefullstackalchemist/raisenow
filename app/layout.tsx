import type { Metadata } from 'next';
import './globals.css';
import { ProfileProvider } from '@/lib/ProfileContext';
import TopNav from '@/components/TopNav/TopNav';
import NoticeBanner from '@/components/NoticeBanner/NoticeBanner';
import ThemeScript from '@/components/ThemeScript';
import SessionWrapper from '@/components/SessionWrapper';

export const metadata: Metadata = {
  title: 'RAISE Now — Resume Analysis Is Super Easy Now',
  description: 'Socratic AI career coach to build your perfect resume',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <SessionWrapper>
          <ProfileProvider>
            <TopNav />
            <main style={{ paddingTop: 'var(--nav-height)' }}>
              <NoticeBanner />
              {children}
            </main>
          </ProfileProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
