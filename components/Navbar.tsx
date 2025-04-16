'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, User, ShoppingCart, Search } from 'lucide-react';

export default function Navbar() {
  const [scrolledDown, setScrolledDown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      setScrolledDown(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (menuOpen) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.width = '100%';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.position = '';
      body.style.width = '';
    }

    const event = new CustomEvent('toggle-menu', { detail: menuOpen });
    window.dispatchEvent(event);

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.position = '';
      body.style.width = '';
    };
  }, [menuOpen]);

  if (!hasMounted) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-[96px]">
      {/* 🔥 Fade Background */}
      <div
        className={`absolute inset-0 bg-[#140000] transition-opacity duration-[1200ms] pointer-events-none ${
          scrolledDown ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 💎 Navbar Content */}
      <div className="relative flex items-center justify-between px-4 py-8 h-full">
        {/* 🍔 Hamburger / X */}
<button
  onClick={() => setMenuOpen(!menuOpen)}
  className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors z-50"
>
  <div
    className={`transition-transform duration-200 ease-in-out ${
      menuOpen ? 'rotate-180 scale-100' : 'rotate-0 scale-100'
    }`}
  >
    {menuOpen ? (
      <X size={28} strokeWidth={1.2} />
    ) : (
      <Menu size={23} strokeWidth={1.2} />
    )}
  </div>
</button>

{/* 🎯 Right Icons */}
<div className="flex items-center gap-6 pr-1 z-40">
  <Link
    href="/account"
    className="hidden md:block cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
  >
    <User size={23} strokeWidth={1.2} />
  </Link>
  <Link
    href="/cart"
    className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
  >
    <ShoppingCart size={23} strokeWidth={1.2} />
  </Link>
  <Link
    href="/search"
    className="hidden md:block cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
  >
    <Search size={23} strokeWidth={1.2} />
  </Link>
</div>

        {/* 🌕 Logo CENTER ALWAYS — Scroll */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-opacity duration-[1200ms] ${
            scrolledDown ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/unda-alunda-header.png"
            alt="Unda Alunda Logo"
            width={180}
            height={50}
            className="mx-auto logo-navbar-img"
            priority
          />
        </div>

        {/* 🌕 Logo for Hamburger — OVERLAY IN SAME POSITION */}
        {menuOpen && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]">
            <Image
              src="/unda-alunda-header.png"
              alt="Unda Alunda Logo"
              width={200}
              height={60}
              className="logo-navbar-img"
              priority
            />
          </div>
        )}
      </div>

      {/* 🍽️ Fullscreen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-transparent flex flex-col items-center justify-center text-[#f8fcdc] text-lg font-semibold tracking-widest space-y-6 z-30 backdrop-blur-none">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">HOME</Link>
          <Link href="/tour" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">TOUR DATES</Link>
          <Link href="/uk" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">UK STORE</Link>
          <Link href="/us" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">US STORE</Link>
          <Link href="/eu" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">EU STORE</Link>
          <Link href="/au" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">AU STORE</Link>
          <Link href="/follow" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">FOLLOW</Link>
        </div>
      )}
    </header>
  );
}