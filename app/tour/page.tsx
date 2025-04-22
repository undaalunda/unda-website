'use client';

import { useEffect, useState } from 'react';

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
    <main className="tour-page-main px-4 pt-32 pb-20 text-[#f8fcdc] font-[Cinzel]">
      <section className="text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#dc9e63] uppercase tracking-wide">
          Tour Dates
        </h3>
      </section>

      <div className="tour-widget-container max-w-4xl mx-auto">
        <div style={{ textAlign: 'left' }}>
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
        </div>
      </div>
    </main>
  );
}