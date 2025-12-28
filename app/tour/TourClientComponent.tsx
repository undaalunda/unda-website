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
                
                // Custom styling after widget loads
                setTimeout(() => {
                  // Make text smaller
                  const widgetTexts = document.querySelectorAll('.bit-widget p, .bit-widget span, .bit-widget div');
                  widgetTexts.forEach((el: any) => {
                    if (el && !el.querySelector('button')) {
                      el.style.fontSize = '12px';
                      el.style.lineHeight = '1.4';
                    }
                  });
                  
                  // Make "No Upcoming" less prominent
                  const noEventsText = document.querySelector('.bit-widget');
                  if (noEventsText) {
                    const textContent = noEventsText.textContent || '';
                    if (textContent.includes('NO UPCOMING') || textContent.includes('No upcoming')) {
                      const noEventElements = document.querySelectorAll('.bit-widget *');
                      noEventElements.forEach((el: any) => {
                        if (el.textContent && (el.textContent.includes('NO UPCOMING') || el.textContent.includes('No upcoming'))) {
                          el.style.color = 'rgba(248, 252, 220, 0.4)';
                          el.style.opacity = '0.6';
                        }
                      });
                    }
                  }
                }, 2000);
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
      
      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 pt-28">
        <section className="text-center w-full max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-[#dc9e63] uppercase tracking-wide">
            Tour Dates
          </h3>
          
          {/* JSON-LD */}
          {jsonLd}
          
          {/* Bandsintown Widget Container with Responsive Styling */}
          <div className="tour-widget-container">
            <div style={{ textAlign: 'left' }}>
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
            </div>
          </div>
        </section>
      </main>
      
      {/* CSS Styling with Responsive Design - Same as Homepage */}
      <style jsx global>{`
        /* Tour Section Responsive Container - Same as Homepage */
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

        /* Bandsintown Widget Text Styling - More general selectors */
        .bit-widget p {
          font-size: 12px !important;
          line-height: 1.4 !important;
        }

        /* Target all text elements in the widget */
        .bit-widget * {
          font-size: 12px !important;
        }

        /* Keep buttons at normal size */
        .bit-widget button,
        .bit-widget .bit-button,
        .bit-widget .bit-button--solid {
          font-size: 14px !important;
        }

        /* Make "No Upcoming Tour Dates" less prominent - try multiple selectors */
        .bit-widget div:contains("NO UPCOMING"),
        .bit-widget span:contains("NO UPCOMING"),
        .bit-widget p:contains("NO UPCOMING"),
        .bit-widget *[class*="no-events"],
        .bit-widget *[class*="empty"] {
          color: rgba(248, 252, 220, 0.4) !important;
          opacity: 0.6 !important;
        }

        /* Button Styling - Same as Homepage */
        .bit-widget button,
        .bit-widget .bit-button,
        .bit-widget .bit-button--solid,
        .tour-section button,
        .tour-widget-container button {
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
        
        /* Hover Effect for Desktop - Same as Homepage */
        @media (hover: hover) and (pointer: fine) {
          .bit-widget button:hover,
          .bit-widget .bit-button:hover,
          .bit-widget .bit-button--solid:hover,
          .tour-section button:hover,
          .tour-widget-container button:hover {
            background-color: #5d0000 !important;
            background: #5d0000 !important;
            border: 1px solid #5d0000 !important;
            color: #f8fcdc !important;
          }
        }
        
        /* Active State for Mobile - Same as Homepage */
        .bit-widget button:active,
        .bit-widget .bit-button:active,
        .bit-widget .bit-button--solid:active,
        .tour-section button:active,
        .tour-widget-container button:active {
          background-color: #5d0000 !important;
          background: #5d0000 !important;
          border: 1px solid #5d0000 !important;
          color: #f8fcdc !important;
          transform: scale(0.98) !important;
        }

        /* Additional Button Styling - Same as Homepage */
        .bit-button,
        .bit-button--solid {
          border-radius: 3px !important;
        }
      `}</style>
    </AppClientWrapper>
  );
}