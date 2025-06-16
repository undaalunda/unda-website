// CookieNotice.tsx - Plini Style Minimal with 480px breakpoint
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieNotice: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  // Check if user has already consented
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  // Accept cookies
  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0d0000]/60 backdrop-blur-md shadow-2xl"
            role="banner"
            aria-label="Cookie consent banner"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center gap-4 cookie-container">
                
                {/* Message */}
                <div className="cookie-message">
                  <p className="text-sm text-[#f8fcdc] font-[Cinzel]">
                    This site uses cookies.{' '}
                    <span className="cookie-find-more">
                      <a
                        href="/privacy-policy"
                        className="text-[#dc9e63] hover:text-[#fcc276] underline transition-colors cursor-pointer"
                      >
                        Find out more
                      </a>
                      .
                    </span>
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={acceptCookies}
                  className="px-4 py-2 text-xs bg-gradient-to-r from-[#dc9e63] to-[#fcc276] text-[#1a1a2e] hover:from-[#fcc276] hover:to-[#dc9e63] transition-all duration-200 rounded-md font-bold font-[Cinzel] cursor-pointer flex-shrink-0"
                >
                  Okay, thanks
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS for 480px breakpoint */}
      <style jsx>{`
        .cookie-container {
          text-align: left;
        }
        
        .cookie-message {
          text-align: left;
        }
        
        .cookie-find-more {
          display: block;
        }
        
        @media (min-width: 480px) {
          .cookie-container {
            text-align: center;
          }
          
          .cookie-message {
            text-align: center;
          }
          
          .cookie-find-more {
            display: inline;
          }
        }
      `}</style>
    </>
  );
};

export default CookieNotice;