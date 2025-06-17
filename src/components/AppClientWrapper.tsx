// AppClientWrapper.tsx - FIXED: Clean social icons alt text

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import CartSuccessPopup from '@/components/CartSuccessPopup';
import CookieNotice from '@/components/CookieNotice';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Lazy load heavy components
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const NewsletterForm = dynamic(() => import('@/components/NewsletterForm'), { 
  ssr: false,
  loading: () => <div style={{ height: '200px' }} />
});

// SVG Social Icons - unchanged for website design
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const SpotifyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.632 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.297 1.33-3.118.922-.82 2.188-1.259 3.561-1.234 1.085.02 2.1.262 3.01.716l.667-1.875c-1.186-.613-2.565-.929-4.107-.94-1.901-.016-3.681.537-5.008 1.554-1.326 1.017-2.01 2.453-1.926 4.04.1 1.844 1.075 3.442 2.744 4.497 1.226.774 2.79 1.154 4.652 1.073 2.1-.091 3.91-.915 5.23-2.383.518-.576.99-1.238 1.4-1.996.6.261 1.149.6 1.624 1.02 1.109.98 1.721 2.274 1.721 3.64 0 2.65-1.186 4.824-3.538 6.477C18.793 23.334 15.849 24 12.186 24zM8.4 16.76c0 .897.32 1.659.951 2.267.631.608 1.463.912 2.476.912.18 0 .36-.01.54-.03 1.013-.108 1.875-.54 2.566-1.287.49-.53.793-1.1.9-1.696-.957-.273-1.915-.408-2.85-.408-1.409-.025-2.638.327-3.583 1.026z"/>
  </svg>
);

export default function AppClientWrapper({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setLastActionItem } = useCart();

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail === true || e.detail === false) {
        setMenuOpen(e.detail);
      }
    };
    window.addEventListener('toggle-menu', handler);
    
    // FIXED: Keep scroll restoration as 'auto'
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
    
    return () => window.removeEventListener('toggle-menu', handler);
  }, []);

  useEffect(() => {
    setLastActionItem(null);
  }, [pathname]);

  return (
    <>
      <Navbar />

      <div
        id="__layout"
        className={`min-h-screen w-full relative transition-opacity duration-500 ${
          menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {children}
        <CartSuccessPopup />

        <div className="global-newsletter-wrapper mt-10">
          <section className="newsletter-section">
            <div className="footer-logo-social">
              <Image
                src="/footer-logo-v7.webp"
                alt="Unda Alunda Logo"
                width={120}
                height={120}
                quality={100}
                loading="lazy"
                unoptimized={true}
                sizes="120px"
                className="glow-logo mx-auto mb-6"
              />
              
              {/* FIXED: Clean social media aria-labels */}
              <div className="social-icons mb-6" role="list" aria-label="Social media links">
                <a 
                  href="https://www.facebook.com/UndaAlunda" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow on Facebook"
                  role="listitem"
                >
                  <FacebookIcon />
                </a>
                <a 
                  href="https://www.youtube.com/@undaalunda" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Watch on YouTube"
                  role="listitem"
                >
                  <YoutubeIcon />
                </a>
                <a 
                  href="https://www.instagram.com/undalunda" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow on Instagram"
                  role="listitem"
                >
                  <InstagramIcon />
                </a>
                <a 
                  href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0?si=JsdyQRqGRCGYfxU_nB_qvQ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Listen on Spotify"
                  role="listitem"
                >
                  <SpotifyIcon />
                </a>
                <a 
                  href="https://twitter.com/undaalunda" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow on Twitter"
                  role="listitem"
                >
                  <TwitterIcon />
                </a>
                <a 
                  href="https://www.threads.net/@undalunda" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow on Threads"
                  role="listitem"
                >
                  <ThreadsIcon />
                </a>
              </div>
              <div className="newsletter-divider"></div>
            </div>

            <div className="newsletter-form-wrapper mb-0">
              <NewsletterForm />
            </div>

            {/* Footer Links - unchanged for website design */}
            <div className="footer-bottom mt-5 text-center">
              <nav 
                className="footer-links flex flex-wrap justify-center items-center gap-2 text-sm text-[#f8fcdc]/80 tracking-wide"
                aria-label="Footer navigation"
              >
                <Link 
                  href="/shipping-and-returns" 
                  className="hover:text-[#dc9e63] transition-colors duration-200"
                >
                  SHIPPING & RETURNS
                </Link>
                <span className="divider" aria-hidden="true">|</span>
                <Link 
                  href="/terms-and-conditions" 
                  className="hover:text-[#dc9e63] transition-colors duration-200"
                >
                  TERMS & CONDITIONS
                </Link>
                <span className="divider" aria-hidden="true">|</span>
                <Link 
                  href="/privacy-policy" 
                  className="hover:text-[#dc9e63] transition-colors duration-200"
                >
                  PRIVACY POLICY
                </Link>
              </nav>
              <p className="text-[#f8fcdc] mt-6 text-xs text-center">
                Copyright © 2025 Unda Alunda
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Cookie Notice - unchanged for website design */}
      <CookieNotice />
    </>
  );
}