//TourClientComponent.tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import AppClientWrapper from '@/components/AppClientWrapper';
import { generateEventJsonLD } from '../../lib/generateEventJsonLD';

export default function TourClientComponent() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // ฟังก์ชัน fetch events
  const fetchEvents = async (attempt = 1) => {
    try {
      const appId = process.env.NEXT_PUBLIC_BANDSINTOWN_APP_ID;
      const url = `https://rest.bandsintown.com/artists/Unda%20Alunda/events?app_id=${appId}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        setTimeout(() => {
          setRetryCount(attempt);
          fetchEvents(attempt + 1);
        }, 2000 * attempt);
      } else {
        setIsLoading(false);
        console.error('All attempts failed');
      }
    }
  };

  // เริ่มต้น component
  useEffect(() => {
    setIsMounted(true);
    fetchEvents();
  }, []);

  const jsonLd = generateEventJsonLD(events).map((event, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
    />
  ));

  // รอให้ component mount เสร็จก่อน
  if (!isMounted) {
    return (
      <AppClientWrapper>
        <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4">
          <section className="text-center w-full max-w-4xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#dc9e63] uppercase tracking-wide">
              Tour Dates
            </h3>
            <div className="mb-6 text-[#f8fcdc] opacity-70">
              <p>Loading...</p>
            </div>
          </section>
        </main>
      </AppClientWrapper>
    );
  }
  
  return (
    <AppClientWrapper>
      {/* Bandsintown Script */}
      <Script
        src="https://widget.bandsintown.com/main.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Bandsintown script loaded');
          // รอให้ script โหลดเสร็จแล้วค่อย init
          setTimeout(() => {
            try {
              if (typeof window !== 'undefined' && (window as any).BIT?.Widget?.init) {
                (window as any).BIT.Widget.init();
                console.log('Widget initialized successfully');
              }
            } catch (error) {
              console.error('Widget init failed:', error);
            }
          }, 1000);
        }}
        onError={(error) => {
          console.error('Script loading failed:', error);
        }}
      />
      
      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4">
        <section className="text-center w-full max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#dc9e63] uppercase tracking-wide">
            Tour Dates
          </h3>
          
          {/* Loading State */}
          {isLoading && (
            <div className="mb-6 text-[#f8fcdc] opacity-70">
              <p>
                Loading tour dates...{' '}
                {retryCount > 0 && `(Attempt ${retryCount + 1})`}
              </p>
            </div>
          )}
          
          {/* JSON-LD */}
          {jsonLd}
          
          {/* Bandsintown Widget */}
          <div
            className="bit-widget-initializer"
            data-artist-name="Unda Alunda"
            data-background-color="transparent"
            data-limit="10"
            data-separator-color="rgba(255,255,255,0.1)"
            data-text-color="#f8fcdc"
            data-link-color="#2a0000"
            data-display-local-dates="false"
            data-display-past-dates="false"
            data-auto-style="false"
            data-date-format="ddd, MMM D, YYYY"
            data-request-show="true"
            data-language="en"
          />
        </section>
      </main>
      
      {/* CSS Styling */}
      <style jsx global>{`
        .bit-widget button,
        .bit-widget .bit-button,
        .bit-widget .bit-button--solid {
          background-color: #2a0000 !important;
          background: #2a0000 !important;
          border: 1px solid #2a0000 !important;
          color: #f8fcdc !important;
          font-family: 'Cinzel', serif !important;
          font-size: 14px !important;
          letter-spacing: 0.15rem !important;
          border-radius: 3px !important;
          font-weight: 500 !important;
          text-align: center !important;
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
          cursor: pointer !important;
        }
        
        @media (hover: hover) and (pointer: fine) {
          .bit-widget button:hover,
          .bit-widget .bit-button:hover,
          .bit-widget .bit-button--solid:hover {
            background-color: #5d0000 !important;
            background: #5d0000 !important;
            border: 1px solid #5d0000 !important;
            color: #f8fcdc !important;
          }
        }
        
        .bit-widget button:active,
        .bit-widget .bit-button:active,
        .bit-widget .bit-button--solid:active {
          background-color: #5d0000 !important;
          background: #5d0000 !important;
          border: 1px solid #5d0000 !important;
          color: #f8fcdc !important;
          transform: scale(0.98) !important;
        }
      `}</style>
    </AppClientWrapper>
  );
}