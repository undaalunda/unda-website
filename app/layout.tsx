'use client';

import Link from 'next/link';
import './globals.css';
import Navbar from '../components/Navbar';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import NewsletterForm from '../components/NewsletterForm';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail === true || e.detail === false) {
        setMenuOpen(e.detail);
      }
    };
    window.addEventListener('toggle-menu', handler);
    return () => window.removeEventListener('toggle-menu', handler);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#160000" />
        <meta
          name="description"
          content="Official Website of Unda Alunda | New album out May 1 2025"
        />
        <title>Unda Alunda | Official Website & Merch Store</title>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body
        className="bg-[#190000] text-[#f8fcdc] m-0 p-0 overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
        }}
      >
        <Navbar />

        <div
          id="__layout"
          className={`min-h-screen w-full relative transition-opacity duration-500 ${
            menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {children}

          {/* ✅ Newsletter & Footer Section - Moved lower with margin */}
          <div className="global-newsletter-wrapper mt-40">
            <section className="newsletter-section">
              <div className="footer-logo-social">
                <Image
                  src="/footer-logo-v7.png"
                  alt="Unda Alunda Cat Logo"
                  width={120}
                  height={120}
                  className="glow-logo mx-auto mb-6"
                />

                <div className="social-icons mb-6">
                  <a href="https://www.facebook.com/UndaAlunda" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook" /></a>
                  <a href="https://www.youtube.com/@undaalunda" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube" /></a>
                  <a href="https://www.instagram.com/undalunda" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /></a>
                  <a href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0?si=JsdyQRqGRCGYfxU_nB_qvQ" target="_blank" rel="noopener noreferrer"><i className="fab fa-spotify" /></a>
                  <a href="https://twitter.com/undaalunda" target="_blank" rel="noopener noreferrer"><i className="fab fa-x-twitter" /></a>
                  <a href="https://www.threads.net/@undalunda" target="_blank" rel="noopener noreferrer"><i className="fab fa-threads" /></a>
                </div>

                {/* ✨ Divider Line Here */}
                <div className="newsletter-divider"></div>
              </div>

              <div className="newsletter-form-wrapper mb-10">
                <NewsletterForm />
              </div>

              {/* 🖋️ Footer Bottom */}
              <div className="footer-bottom">
                <div className="footer-links">
                  <a href="/shipping">Shipping & Returns</a>
                  <span className="divider">|</span>
                  <a href="/terms">Terms & Conditions</a>
                  <span className="divider">|</span>
                  <a href="/privacy">Privacy Policy</a>
                </div>
                <p className="copyright text-xs text-[#f8fcdc] mb-4">
                  Copyright © 2025 UNDA ALUNDA
                </p>
              </div>
            </section>
          </div>
        </div>
      </body>
    </html>
  );
}
