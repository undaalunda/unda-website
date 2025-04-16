'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, ShoppingCart, Search } from 'lucide-react';

export default function Navbar() {
  const [scrolledDown, setScrolledDown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      setScrolledDown(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!hasMounted) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* 🔥 Fade Background */}
      <div
        className={`absolute inset-0 bg-[##140000] transition-opacity duration-[1200ms] pointer-events-none ${
          scrolledDown ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 💎 Navbar Content */}
      <div className="relative flex items-center justify-between px-4 py-8">
        {/* 🍔 Hamburger */}
        <Link
          href="/menu"
          className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
        >
          <Menu size={22} strokeWidth={1.2} />
        </Link>

        {/* 🌕 Center Logo */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-[1200ms] ${
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

        {/* 🎯 Right Icons */}
        <div className="flex items-center gap-6 md:pr-2 z-10">
          {/* 👤 User icon (desktop only) */}
          <Link
            href="/account"
            className="hidden md:block cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
          >
            <User size={22} strokeWidth={1.2} />
          </Link>

          {/* 🛒 Cart */}
          <Link
            href="/cart"
            className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
          >
            <ShoppingCart size={22} strokeWidth={1.2} />
          </Link>

          {/* 🔍 Search — ซ่อนบน mobile */}
          <Link
            href="/search"
            className="hidden md:block cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
          >
            <Search size={22} strokeWidth={1.2} />
          </Link>
        </div>
      </div>
    </header>
  );
}