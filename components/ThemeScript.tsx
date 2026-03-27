'use client';

import { useEffect } from 'react';

// Inline script injected before hydration to avoid flash
export default function ThemeScript() {
  useEffect(() => {
    const stored = localStorage.getItem('raise-theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var t = localStorage.getItem('raise-theme');
              if (t) document.documentElement.setAttribute('data-theme', t);
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}
