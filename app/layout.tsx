'use client';

import './globals.css';
import Navbar from '../components/Navbar';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* เปลี่ยนให้ตรงกับธีม overscroll */}
        <meta name="theme-color" content="#190000" />
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
        {/* 🧠 Global Navbar */}
        <Navbar />

        {/* 🧱 Content Wrapper */}
        <div id="__layout" className="min-h-screen w-full relative">
          {children}
        </div>
      </body>
    </html>
  );
}