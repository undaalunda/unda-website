// AppClientWrapper.tsx - Performance Optimized

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import CartSuccessPopup from '@/components/CartSuccessPopup';
import NewsletterForm from '@/components/NewsletterForm';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// 🚀 Lazy load Navbar for better initial load
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

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
                src="/footer-logo-v7.webp"  // 🚀 เปลี่ยนเป็น WebP
                alt="Unda Alunda Cat Logo"
                width={120}
                height={120}
                quality={90}  // 🎯 ปรับ quality ลงเล็กน้อย
                loading="lazy" // 🚀 Lazy load footer logo
                sizes="120px" // 📐 Fixed size
                className="glow-logo mx-auto mb-6"
              />
              <div className="social-icons mb-6">
                <a href="https://www.facebook.com/UndaAlunda" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook" />
                </a>
                <a href="https://www.youtube.com/@undaalunda" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube" />
                </a>
                <a href="https://www.instagram.com/undalunda" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram" />
                </a>
                <a href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0?si=JsdyQRqGRCGYfxU_nB_qvQ" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-spotify" />
                </a>
                <a href="https://twitter.com/undaalunda" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-x-twitter" />
                </a>
                <a href="https://www.threads.net/@undalunda" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-threads" />
                </a>
              </div>
              <div className="newsletter-divider"></div>
            </div>

            <div className="newsletter-form-wrapper mb-0">
              <NewsletterForm />
            </div>

            <div className="footer-bottom mt-5 text-center">
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
              <p className="text-[#f8fcdc] mt-6 text-xs text-center">
                Copyright © 2025 Unda Alunda
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}