import './globals.css';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Head from 'next/head';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShowButtons(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (buttonGroupRef.current) {
      observer.observe(buttonGroupRef.current);
    }

    return () => {
      if (buttonGroupRef.current) {
        observer.unobserve(buttonGroupRef.current);
      }
    };
  }, []);

  return (
    <html lang="en">
      <head>
        {/* ✅ Favicon & Metadata */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Official Website of Unda Alunda | New album out May 1 2025" />
        <title>Unda Alunda | Official Website</title>
      </head>

      <body style={{
        margin: 0,
        fontFamily: 'Cinzel, serif',
        backgroundColor: '#000000'
      }}>
        {pathname === '/' && (
          <>
            <div className="hero-wrapper">
              <div className="catmoon-background" />
              <div className="hero-text-image">
                <Image
                  src="/text-hero-section.png"
                  alt="Dark Wonderful World on Moon"
                  height={400}
                  width={600}
                  priority
                />
              </div>

              {/* Desktop Headline */}
              <div className="hero-text desktop-only">
                <p className="hero-line1">
                  THE NEW ALBUM'S COMING <span className="highlight">MAY 1 2025</span>
                </p>
                <p className="hero-line2">
                  AVAILABLE NOW TO{' '}
                  <Link href="/preorder" className="hero-cta-link">PRE-ORDER</Link>{' '}
                  &{' '}
                  <Link href="/presave" className="hero-cta-link">PRE-SAVE</Link>
                </p>
              </div>

              {/* Mobile Headline */}
              <div className="hero-text mobile-only">
                <p className="hero-line1">THE NEW ALBUM'S COMING</p>
                <p className="hero-line1"><span className="highlight">MAY 1 2025</span></p>
                <p className="hero-line2">AVAILABLE NOW TO</p>
                <p className="hero-line2">
                  <Link href="/preorder" className="hero-cta-link">PRE-ORDER</Link>{' '}
                  &{' '}
                  <Link href="/presave" className="hero-cta-link">PRE-SAVE</Link>
                </p>
              </div>
            </div>

            <div
              ref={buttonGroupRef}
              className={`button-group ${showButtons ? 'fade-in' : ''}`}
            >
              <Link href="/scores" className="info-button">SCORES</Link>
              <Link href="/stems-samples" className="info-button">STEMS & SAMPLES</Link>
              <Link href="/merch" className="info-button">MERCH</Link>
              <Link href="/physical" className="info-button">PHYSICAL ALBUMS</Link>
              <Link href="/digital" className="info-button">DIGITAL ALBUMS</Link>
            </div>
          </>
        )}

        <main style={{ paddingTop: '100px', position: 'relative' }}>
          {children}
        </main>
      </body>
    </html>
  );
}