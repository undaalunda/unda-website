'use client';

import './globals.css';
import Navbar from '../components/Navbar';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // ให้ Navbar toggle menu ส่งมาที่ layout
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
        <meta name="theme-color" content="#140000" />
        <meta
          name="description"
          content="Official Website of Unda Alunda | New album out May 1 2025"
        />
        <title>Unda Alunda | Official Website & Merch Store</title>
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
        </div>
      </body>
    </html>
  );
}