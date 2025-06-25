// components/BandsinTownWidget.tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function BandsinTownWidget() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  return (
    <>
      <Script
        src="https://widget.bandsintown.com/main.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
          console.log('Bandsintown widget loaded lazily');
        }}
      />
      
      <div
        className="bit-widget-initializer"
        data-artist-name="Unda Alunda"
        data-background-color="transparent"
        data-limit="5"
        data-separator-color="rgba(255,255,255,0.1)"
        data-text-color="#f8fcdc"
        data-link-color="#2a0000"
        data-display-local-dates="false"
        data-display-past-dates="false"
        data-auto-style="false"
        data-display-limit="5"
        data-date-format="ddd, MMM D, YYYY"
        data-request-show="true"
        data-language="en"
      />
      
      <style jsx global>{`
        /* REQUEST A SHOW Button Styling */
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
        
        /* Hover Effect for Desktop */
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
        
        /* Active State for Mobile */
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
      `}</style>
    </>
  );
}