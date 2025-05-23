//TourClientComponent.tsx

'use client';

import { useEffect, useState } from 'react';
import AppClientWrapper from '@/components/AppClientWrapper';
import { generateEventJsonLD } from '../../lib/generateEventJsonLD';

export default function TourClientComponent() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_BANDSINTOWN_APP_ID;
    const url = `https://rest.bandsintown.com/artists/Unda%20Alunda/events?app_id=${appId}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []));
  }, []);

  const jsonLd = generateEventJsonLD(events).map((event, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
    />
  ));

  return (
    <AppClientWrapper>
      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4">
        <section className="text-center w-full max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#dc9e63] uppercase tracking-wide">
            Tour Dates
          </h3>

          {/* ✅ Inject JSON-LD dynamically from Bandsintown */}
          {jsonLd}

          {/* ✅ Bandsintown Widget */}
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
        </section>
      </main>
    </AppClientWrapper>
  );
}