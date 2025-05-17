'use client';

import { useEffect, useState } from 'react';
import AppClientWrapper from '@/components/AppClientWrapper';

export default function TourPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const script = document.createElement('script');
    script.src = 'https://widget.bandsintown.com/main.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <AppClientWrapper>
      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4">
        <section className="text-center w-full max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#dc9e63] uppercase tracking-wide">
            Tour Dates
          </h3>

          {isClient ? (
            <div
              className="bit-widget-initializer"
              data-artist-name="Unda Alunda"
              data-background-color="transparent"
              data-limit="10"
              data-separator-color="rgba(255,255,255,0.1)"
              data-text-color="#f8fcdc"
              data-link-color="#dc9e63"
              data-display-local-dates="false"
              data-display-past-dates="false"
              data-auto-style="false"
              data-date-format="ddd, MMM D, YYYY"
              data-request-show="true"
              data-language="en"
            />
          ) : (
            <div style={{ height: '400px' }} />
          )}
        </section>
      </main>
    </AppClientWrapper>
  );
}