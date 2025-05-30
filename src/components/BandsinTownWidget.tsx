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
        strategy="lazyOnload" // 🚀 โหลดหลังสุด
        onLoad={() => {
          setScriptLoaded(true);
          console.log('Bandsintown widget loaded lazily');
        }}
      />
      <div
        className="bit-widget-initializer"
        data-artist-name="Unda Alunda"
        data-background-color="transparent"
        data-limit="5" // 🎯 ลดเหลือ 5 รายการ (homepage ไม่ต้องเยอะ)
        data-separator-color="rgba(255,255,255,0.1)"
        data-text-color="#f8fcdc"
        data-link-color="#dc9e63"
        data-display-local-dates="false"
        data-display-past-dates="false"
        data-auto-style="false"
        data-display-limit="5"
        data-date-format="ddd, MMM D, YYYY"
        data-request-show="true"
        data-language="en"
      />
      
      {/* 💡 Link ไป Tour page เต็ม */}
      {scriptLoaded && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a 
            href="/tour" 
            style={{ 
              color: '#dc9e63', 
              fontSize: '0.875rem',
              textDecoration: 'none',
              borderBottom: '1px solid #dc9e63'
            }}
          >
            View All Tour Dates →
          </a>
        </div>
      )}
    </>
  );
}