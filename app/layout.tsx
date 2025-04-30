'use client';

import Link from 'next/link';
import './globals.css';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import NewsletterForm from '../src/components/NewsletterForm';
import CurrencySelector from '../src/components/CurrencySelector';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CartProvider } from '@/context/CartContext';
import CartSuccessPopup from '@/components/CartSuccessPopup'; // ✅ import Popup เข้ามาด้วย!

const Navbar = dynamic(() => import('../src/components/Navbar'), { ssr: false });

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
        <meta name="description" content="Official Website of Unda Alunda | New album out May 1 2025" />
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
        <CurrencyProvider>
          <CartProvider>
            <Navbar />

            <div
              id="__layout"
              className={`min-h-screen w-full relative transition-opacity duration-500 ${
                menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* ✅ children ก่อน */}
              {children}

              {/* ✅ Popup สำเร็จ */}
              <CartSuccessPopup />

              {/* ✅ Footer & Newsletter Section */}
              <div className="global-newsletter-wrapper mt-10">
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

                    <div className="newsletter-divider"></div>
                  </div>

                  <div className="newsletter-form-wrapper mb-0">
                    <NewsletterForm />
                  </div>

                  <div className="footer-bottom mt-6 text-center">
  <div className="footer-links flex flex-wrap justify-center items-center gap-2 text-sm text-[#f8fcdc]/80 tracking-wide">
    <Link href="/shipping-and-returns" className="hover:text-[#dc9e63] transition-colors duration-200">
      SHIPPING & RETURNS
    </Link>
    <span className="divider">|</span>
    <Link href="/terms-and-conditions" className="hover:text-[#dc9e63] transition-colors duration-200">
      TERMS & CONDITIONS
    </Link>
    <span className="divider">|</span>
    <Link href="/privacy-policy" className="hover:text-[#dc9e63] transition-colors duration-200">
      PRIVACY POLICY
    </Link>
  </div>

  <div className="mt-6 mb-4">
    <CurrencySelector />
  </div>

  <p className="copyright text-xs text-[#f8fcdc] mb-0 tracking-wide">
    Copyright © 2025 UNDA ALUNDA
  </p>
</div>
                </section>
              </div>

            </div>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}