// TourClientComponent.tsx
'use client';

import { useEffect, useState } from 'react';
import AppClientWrapper from '@/components/AppClientWrapper';
import { generateEventJsonLD } from '../../lib/generateEventJsonLD';
import BandsinTownWidget from '@/components/BandsinTownWidget';

export default function TourClientComponent() {
  const [events, setEvents] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchEvents = async () => {
      try {
        const appId = process.env.NEXT_PUBLIC_BANDSINTOWN_APP_ID;
        const res = await fetch(
          `https://rest.bandsintown.com/artists/Unda%20Alunda/events?app_id=${appId}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    fetchEvents();
  }, []);

  const jsonLd = generateEventJsonLD(events).map((event, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
    />
  ));

  if (!isMounted) {
    return (
      <AppClientWrapper>
        <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 pt-28">
          <section className="text-center w-full max-w-4xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#dc9e63] uppercase tracking-wide">
              Tour Dates
            </h3>
          </section>
        </main>
      </AppClientWrapper>
    );
  }

  return (
    <AppClientWrapper>
     

      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 pt-28">
        <section className="text-center w-full max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#dc9e63] uppercase tracking-wide">
            Tour Dates
          </h3>

          {jsonLd}

          <div className="tour-widget-container">
            <div style={{ textAlign: 'left' }}>

              <BandsinTownWidget />
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        /* ซ่อน event list ของ official widget เหลือแค่ Track bar */
        .bit-widget .bit-offers,
        .bit-widget .bit-event,
        .bit-widget .bit-no-dates,
        .bit-widget .bit-request-show,
        .bit-widget [class*="event-list"],
        .bit-widget [class*="eventList"] {
          display: none !important;
        }

        /* ดัน official widget ลงมา */
        .bit-widget {
  margin-top: 4rem !important;
  padding-bottom: 0 !important;
}

        /* ลด font size Track bar */
        .bit-widget,
        .bit-widget * {
          font-size: 11px !important;
        }

        /* Upcoming Dates — บางแต่ไม่จาง */
        .bit-widget [class*="upcoming"],
        .bit-widget [class*="Upcoming"],
        .bit-widget .bit-upcoming-dates,
        .bit-widget .bit-header {
          display: block !important;
          font-size: 11px !important;
          opacity: 1 !important;
          font-weight: 300 !important;
        }

        /* Restore hover สำหรับ custom widget */
        @media (hover: hover) and (pointer: fine) {
          .bit-event-row:hover {
            background-color: rgba(248, 252, 220, 0.03) !important;
          }
          .bit-btn-rsvp:hover {
            background-color: rgba(248, 252, 220, 0.06) !important;
            border-color: rgba(248, 252, 220, 0.5) !important;
          }
          .bit-btn-tickets:hover {
            background-color: #5d0000 !important;
            border-color: #5d0000 !important;
          }
          .bit-btn-request:hover {
            background-color: #5d0000 !important;
            border-color: #5d0000 !important;
          }
        }

        .tour-widget-container {
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
          max-width: 100%;
        }

        @media (min-width: 480px) {
          .tour-widget-container {
            max-width: 500px;
          }
        }

        @media (min-width: 769px) {
          .tour-widget-container {
            max-width: 600px;
          }
        }

        @media (min-width: 1280px) {
          .tour-widget-container {
            max-width: 960px;
          }
        }
      `}</style>
    </AppClientWrapper>
  );
}