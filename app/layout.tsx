'use client';

import './globals.css';
import Navbar from '../components/Navbar'; // ✅ เปลี่ยน path ถ้าไฟล์อยู่ที่อื่น
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