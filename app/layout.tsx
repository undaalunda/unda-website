'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Official Website of Unda Alunda | New album out May 1 2025"
        />
        <title>Unda Alunda | Official Website & Merch Store</title>
      </head>
      <body className="bg-black text-white m-0 p-0 overflow-x-hidden">
        {/* Ensure no unwanted top space and allow background to sit correctly */}
        <div id="__layout" className="min-h-screen w-full relative">
          {children}
        </div>
      </body>
    </html>
  );
}
