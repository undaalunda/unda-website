// AppClientWrapper.tsx

'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import CartSuccessPopup from '@/components/CartSuccessPopup';
import CookieNotice from '@/components/CookieNotice';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Menu, ShoppingCart, Search, X, ChevronDown } from 'lucide-react';
import { allItems } from '@/components/allItems';

// Lazy load heavy components
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const NewsletterForm = dynamic(() => import('@/components/NewsletterForm'), { 
  ssr: false,
  loading: () => <div style={{ height: '200px' }} />
});

// Page links for search
const pageLinks = [
  { title: 'Home', href: '/' },
  { title: 'Shop', href: '/shop' },
  { title: 'About', href: '/about' },
  { title: 'Tour', href: '/tour' },
  { title: 'Contact', href: '/contact' },
];

// Music streaming platforms
const musicLinks = [
  { title: 'Spotify', href: 'https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0' },
  { title: 'Apple', href: 'https://music.apple.com/us/artist/unda-alunda/1543677299' },
  { title: 'Deezer', href: 'https://www.deezer.com/en/artist/115903802' },
  { title: 'Tidal', href: 'https://tidal.com/browse/artist/22524871' },
  { title: 'Amazon', href: 'https://music.amazon.com/artists/B08PVKFZDZ/unda-alunda' },
];

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
  const router = useRouter();
  const { setLastActionItem, cartItems } = useCart();
  
  // 🔥 เพิ่ม states สำหรับระบบเสิร์ชแบบเดียวกับ Navbar
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [delayedQuery, setDelayedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const resultRefs = useRef<(HTMLElement | null)[]>([]); 
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const [desktopMusicDropdownOpen, setDesktopMusicDropdownOpen] = useState(false);
  const [navbarDropdownOpen, setNavbarDropdownOpen] = useState(false);
  
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const desktopMusicRef = useRef<HTMLDivElement>(null);

  // Check if we're on homepage to avoid duplicate navbar
  const isHomepage = pathname === '/';

  // 🔥 เพิ่ม search logic แบบเดียวกับ Navbar
const filtered = useMemo(() => {
  const q = delayedQuery.toLowerCase().trim();
  const queryWords = q.split(/\s+/);

  return q.length > 0
    ? allItems.filter((item) => {
        const fields = [
          item.title,
          item.subtitle,
          item.category,
          item.description,
          ...(item.tags || []),
          typeof item.price === 'number'
            ? item.price.toString()
            : `${item.price?.original || ''} ${item.price?.sale || ''}`
        ]
          .filter(Boolean)
          .map((val) => String(val).toLowerCase());

        return queryWords.every((word) =>
          fields.some((field) => field.includes(word))
        );
      })
    : [];
}, [delayedQuery]);

const suggestions = useMemo(() => {
  const q = delayedQuery.toLowerCase();
  const tags = allItems.flatMap((item) => item.tags).filter(Boolean);
  const titles = allItems.map((item) => item.title);
  const allTerms = [...tags, ...titles];
  const unique = Array.from(new Set(allTerms));
  return q.length > 0
    ? unique.filter((term) => term.toLowerCase().startsWith(q)).slice(0, 6)
    : [];
}, [delayedQuery]);

const pageMatches = useMemo(() => {
  const q = delayedQuery.toLowerCase();
  return q.length > 0
    ? pageLinks.filter((page) => page.title.toLowerCase().includes(q))
    : [];
}, [delayedQuery]);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail === true || e.detail === false) {
        setMenuOpen(e.detail);
      }
    };
    window.addEventListener('toggle-menu', handler);
    
    // Keep scroll restoration as 'auto'
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
    
    return () => window.removeEventListener('toggle-menu', handler);
  }, []);

  useEffect(() => {
    setLastActionItem(null);
  }, [pathname]);

  // 🔥 เพิ่ม search effects แบบเดียวกับ Navbar
useEffect(() => {
  if (searchQuery === '') {
    setDelayedQuery('');
  } else {
    const handler = setTimeout(() => {
      setDelayedQuery(searchQuery);
      setHighlightIndex(0);
    }, 300);
    return () => clearTimeout(handler);
  }
}, [searchQuery]);

useEffect(() => {
  if (searchOpen && resultRefs.current[highlightIndex]) {
    resultRefs.current[highlightIndex]?.scrollIntoView({ block: 'nearest' });
  }
}, [highlightIndex, searchOpen]);

useEffect(() => {
  if (searchOpen) {
    setHighlightIndex(0);
  }
}, [searchOpen]);

  // Handle navbar states and body scroll lock
  useEffect(() => {
    // Listen for navbar dropdown events
    const handleNavbarDropdown = (e: CustomEvent) => {
      setNavbarDropdownOpen(e.detail);
    };
    
    window.addEventListener('navbar-dropdown-toggle', handleNavbarDropdown as EventListener);

    // Handle menu body scroll lock
    const body = document.body;
    if (menuOpen) {
      body.style.position = 'fixed';
      body.style.width = '100%';
    } else {
      body.style.position = '';
      body.style.width = '';
      setMusicDropdownOpen(false); // Close mobile music dropdown when menu closes
    }

    // Handle search body scroll lock
    if (searchOpen) {
      body.style.position = 'fixed';
      body.style.width = '100%';
    } else if (!menuOpen) {
      body.style.position = '';
      body.style.width = '';
    }

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDesktopMusicDropdownOpen(false);
      }
    };

    // Click outside handlers
    const handleClickOutside = (e: MouseEvent) => {
      // Desktop music dropdown click outside
      if (
        desktopMusicRef.current &&
        !desktopMusicRef.current.contains(e.target as Node)
      ) {
        setDesktopMusicDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('navbar-dropdown-toggle', handleNavbarDropdown as EventListener);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      body.style.position = '';
      body.style.width = '';
    };
  }, [menuOpen, searchOpen]);

  // เพิ่มหลัง useEffect อื่นๆ
useEffect(() => {
  console.log('AppClient sending menu toggle:', menuOpen);
  const event = new CustomEvent('toggle-menu', { detail: menuOpen });
  window.dispatchEvent(event);
}, [menuOpen]);

// 🔥 เพิ่ม keyboard handler สำหรับเสิร์ช
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const hasQuery = delayedQuery.length > 0;
  const productCount = filtered.length;
  const suggestionCount = suggestions.length;
  const pageCount = pageMatches.length;
  const recentCount = recentSearches.length;
  const menuCount = pageLinks.length;

  const totalCount = hasQuery
    ? 1 + productCount + suggestionCount + pageCount + recentCount
    : 1 + menuCount;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setHighlightIndex((prev) => {
      const next = prev + 1;
      if (next >= totalCount) {
        return 1;
      }
      return next;
    });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setHighlightIndex((prev) => {
      const next = prev - 1;
      if (next < 1) {
        return totalCount - 1;
      }
      return next;
    });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const el = resultRefs.current[highlightIndex];
    if (el) {
      const q = searchQuery.trim();
      if (q.length > 0) {
        setRecentSearches((prev) => {
          const withoutDupes = prev.filter((t) => t !== q);
          return [q, ...withoutDupes].slice(0, 5);
        });
      }
      const link = el.querySelector('a');
      if (link) {
        (link as HTMLElement).click();
      } else {
        el.click();
      }
    }
  }
};

  return (
    <>
      {/* 🔥 แสดง Navbar ทุกหน้า รวมทั้ง homepage */}
      {!isHomepage && <Navbar />}

      {/* 🔥 GLOBAL STATIC NAVBAR - Desktop ≥1280px (Shows on HOMEPAGE only) - ซ่อนเมื่อเปิด menu */}
{isHomepage && !menuOpen && !searchOpen && (
  <div className="absolute top-0 left-2 right-0 h-[96px] z-[9999] hidden xl:flex items-center justify-between px-4" style={{ pointerEvents: 'auto' }}>
        {/* Left side: Logo + Navigation */}
        <div className="flex items-center gap-8" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10000 }}>
          {/* Logo */}
          <Link 
            href="/" 
            className="block"
            aria-label="Unda Alunda - Go to homepage"
          >
            <Image
              src="/unda-alunda-header.webp"
              alt="Unda Alunda Logo"
              width={180}
              height={45}
              quality={100}
              priority
              unoptimized={true}
              sizes="180px"
              className={`logo-navbar-img ${menuOpen ? 'hamburger-logo' : ''}`}
            />
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="flex items-center gap-6 ml-2" style={{ transform: 'translateY(2px)', position: 'relative', zIndex: 70 }} aria-label="Main navigation">
            <Link 
              href="/" 
              className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase"
              style={{ letterSpacing: '0.25em' }}
            >
              HOME
            </Link>
            <Link 
              href="/shop" 
              className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase"
              style={{ letterSpacing: '0.25em' }}
            >
              SHOP
            </Link>
            
            {/* Music Dropdown */}
            <div 
              ref={desktopMusicRef}
              className="relative"
              onMouseEnter={() => {
                setDesktopMusicDropdownOpen(true);
                window.dispatchEvent(new CustomEvent('navbar-dropdown-toggle', { detail: true }));
              }}
              onMouseLeave={() => {
                setDesktopMusicDropdownOpen(false);
                window.dispatchEvent(new CustomEvent('navbar-dropdown-toggle', { detail: false }));
              }}
            >
              <button
                className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase cursor-pointer"
                style={{ letterSpacing: '0.25em', transform: 'translateY(-2px)' }}
                aria-expanded={desktopMusicDropdownOpen}
                aria-controls="desktop-music-submenu"
              >
                MUSIC
              </button>

              {/* Dropdown Menu */}
              <div
                id="desktop-music-submenu"
                className={`absolute top-full left-0 mt-2 bg-[#3a1515]/60 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden transition-all duration-300 z-50 ${
                  desktopMusicDropdownOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform translate-y-2'
                }`}
                style={{ minWidth: '140px' }}
              >
                {musicLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-5 py-3 text-[#f8fcdc] hover:text-[#dc9e63] hover:bg-[#dc9e63]/15 transition-all duration-200 text-xs font-normal border-b border-[#f8fcdc]/10 last:border-b-0"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>

            <Link 
              href="/about" 
              className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase"
              style={{ letterSpacing: '0.25em' }}
            >
              ABOUT
            </Link>
            <Link 
              href="/tour" 
              className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase"
              style={{ letterSpacing: '0.25em' }}
            >
              TOUR
            </Link>
            <Link 
              href="/contact" 
              className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase"
              style={{ letterSpacing: '0.25em' }}
            >
              CONTACT
            </Link>
          </nav>
        </div>

        {/* Right side: Cart + Search */}
        <div className="flex items-center gap-7 xl:gap-9 -translate-x-4" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10000 }}>
          {/* Cart button */}
          <Link
            href="/cart"
            className="relative cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
            aria-label={`Shopping cart with ${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`}
          >
            <ShoppingCart
              size={23}
              strokeWidth={1.2}
              className="transition-opacity duration-300 opacity-70 hover:opacity-100"
              aria-hidden="true"
            />
            {totalQuantity > 0 && (
              <span 
                className="absolute -top-2 -right-2 bg-[#dc9e63] text-[#160000] rounded-full w-5 h-5 flex items-center justify-center text-xs font-light"
                aria-hidden="true"
              >
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
            aria-label="Open search"
          >
            <Search
              size={23}
              strokeWidth={1.2}
              className="transition-opacity duration-300 opacity-70 hover:opacity-100"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      )}

      {/* 🔥 GLOBAL STATIC NAVBAR - Mobile/Tablet <1280px (Shows on HOMEPAGE only) - ซ่อนเมื่อเปิด menu */}
{isHomepage && !menuOpen && !searchOpen && (
  <div className="absolute top-0 left-0 right-0 h-[96px] z-50 xl:hidden">
        <div className="relative flex items-center justify-between px-4 py-8 h-full">
          
          {/* LEFT LAYOUT - Standard Style (Hamburger + Logo ทางซ้าย) */}
          {!searchOpen && (
            <div className="flex items-center gap-4 z-40">
              {/* Hamburger menu button - ซ้ายสุด */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-all duration-[1200ms] z-50"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="main-navigation"
              >
                <div
  style={{
    transform: menuOpen ? 'rotate(180deg) scale(1)' : 'rotate(0deg) scale(1)',
    transition: 'transform 0.2s ease-in-out'
  }}
>
                  {menuOpen ? (
                    <X size={28} strokeWidth={1.2} aria-hidden="true" />
                  ) : (
                    <Menu
                      size={23}
                      strokeWidth={1.2}
                      className="transition-opacity duration-300 opacity-70 hover:opacity-100"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </button>

              {/* Logo/Header - ถัดจาก Hamburger */}
              <Link 
                href="/" 
                className="block"
                onClick={menuOpen ? () => setMenuOpen(false) : undefined}
                aria-label="Unda Alunda - Go to homepage"
              >
                <Image
                  src="/unda-alunda-header.webp"
                  alt="Unda Alunda Logo"
                  width={180}
                  height={45}
                  quality={100}
                  priority
                  unoptimized={true}
                  sizes="(max-width: 768px) 120px, 180px"
                  className={`logo-navbar-img ${menuOpen ? 'hamburger-logo' : ''}`}
                />
              </Link>
            </div>
          )}

          {/* CART & SEARCH - แสดงตลอดไม่ fade (ซ่อนเมื่อเปิด menu) */}
          {!searchOpen && !menuOpen && (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-7 -translate-x-4 z-40">
              {/* Cart button */}
              <Link
                href="/cart"
                className="relative cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
                aria-label={`Shopping cart with ${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`}
              >
                <ShoppingCart
                  size={23}
                  strokeWidth={1.2}
                  className="transition-opacity duration-300 opacity-70 hover:opacity-100"
                  aria-hidden="true"
                />
                {totalQuantity > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 bg-[#dc9e63] text-[#160000] rounded-full w-5 h-5 flex items-center justify-center text-xs font-light"
                    aria-hidden="true"
                  >
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {/* Search button - desktop only เมื่อไม่เปิด menu */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:block cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
                aria-label="Open search"
              >
                <Search
                  size={23}
                  strokeWidth={1.2}
                  className="transition-opacity duration-300 opacity-70 hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* MENU OPEN OVERLAY - Only for mobile/tablet */}
      {menuOpen && !searchOpen && (
        <div className="fixed inset-0 bg-transparent z-30 backdrop-blur-none">
          {/* Menu Header - เหมือนรูปที่ 2 */}
          <div className="absolute top-0 left-0 right-0 h-[96px] z-60">
            <div className="relative flex items-center justify-between px-4 py-8 h-full">
              {/* X ซ้าย */}
              <button
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors z-70"
              >
                <X size={28} strokeWidth={1.2} />
              </button>

              {/* Logo กลาง */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-60">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <Image
                    src="/unda-alunda-header.webp"
                    alt="Unda Alunda Logo"
                    width={180}
                    height={45}
                    quality={100}
                    priority
                    unoptimized={true}
                    sizes="(max-width: 768px) 120px, 180px"
                    className={`logo-navbar-img ${menuOpen ? 'hamburger-logo' : ''}`}
                  />
                </Link>
              </div>

              {/* 🔍 ขวา */}
              <button
                onClick={() => setSearchOpen(true)}
                className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors z-70 -translate-x-4"
              >
                <Search size={23} strokeWidth={1.2} />
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex flex-col items-center justify-center text-[#f8fcdc] text-lg font-semibold tracking-widest space-y-6 font-[Cinzel] min-h-screen">
            <nav 
              id="main-navigation"
              className="flex flex-col items-center space-y-6"
              aria-label="Main navigation"
            >
              <Link 
                href="/" 
                onClick={() => setMenuOpen(false)} 
                className="hover:text-[#dc9e63] transition-colors duration-300"
              >
                HOME
              </Link>
              <Link 
                href="/shop" 
                onClick={() => setMenuOpen(false)} 
                className="hover:text-[#dc9e63] transition-colors duration-300"
              >
                SHOP
              </Link>
              
              {/* MUSIC DROPDOWN - เฉพาะลิงก์ที่กดได้ */}
              <div className="flex flex-col items-center z-30 font-[Cinzel] w-full">
                <button
                  onClick={() => setMusicDropdownOpen(!musicDropdownOpen)}
                  className="hover:text-[#dc9e63] text-[#f8fcdc] text-lg font-semibold tracking-widest cursor-pointer transition-colors duration-300"
                  aria-expanded={musicDropdownOpen}
                  aria-controls="music-submenu"
                  aria-label="Music streaming platforms"
                >
                  MUSIC
                </button>

                <div
                  id="music-submenu"
                  className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    flex flex-col items-center text-sm font-thin text-[#f8fcdc]/60 space-y-1
                    ${musicDropdownOpen ? 'max-h-60 mt-2' : 'max-h-0'}
                  `}
                  role="menu"
                  aria-labelledby="music-button"
                >
                  {musicLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-[#dc9e63] transition-colors duration-300 cursor-pointer"
                      role="menuitem"
                      aria-label={`Listen on ${link.title}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
              
              <Link 
                href="/about" 
                onClick={() => setMenuOpen(false)} 
                className="hover:text-[#dc9e63] transition-colors duration-300"
              >
                ABOUT
              </Link>
              <Link 
                href="/tour" 
                onClick={() => setMenuOpen(false)} 
                className="hover:text-[#dc9e63] transition-colors duration-300"
              >
                TOUR
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMenuOpen(false)} 
                className="hover:text-[#dc9e63] transition-colors duration-300"
              >
                CONTACT
              </Link>
            </nav>
          </div>
        </div>
      )}
      
      {/* 🔥 SEARCH OVERLAY - ใช้ระบบเดียวกับ Navbar.tsx */}
{searchOpen && (
  <div 
    className="fixed inset-0 z-40 bg-[#0d0d0dea] overflow-y-auto"
    role="dialog"
    aria-label="Search products"
    aria-modal="true"
  >
    <div className="min-h-screen flex flex-col items-center px-2 md:px-4 xl:px-6 pt-32 md:pt-36 xl:pt-40 pb-20">
      <div
        ref={searchOverlayRef}
        className="w-full max-w-6xl flex flex-col items-center fade-in-section"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = searchQuery.trim();
            if (q.length > 0) {
              setRecentSearches((prev) => {
                const withoutDupes = prev.filter((t) => t !== q);
                return [q, ...withoutDupes].slice(0, 5);
              });
            }
          }}
          className="relative w-full max-w-xl"
          role="search"
        >
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[#f8fcdc]/50" aria-hidden="true">
              <Search size={20} />
            </span>
            <label htmlFor="search-input" className="sr-only">Search products</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)} 
              autoFocus
              className="w-full pl-12 pr-12 py-2 text-base text-[#f8fcdc] caret-[#dc9e63] bg-transparent border border-[#dc9e63] rounded-md placeholder:text-[#777] outline-none focus:ring-0 focus:outline-none"
              aria-describedby="search-instructions"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[#f8fcdc] hover:text-[#dc9e63] transition cursor-pointer"
              aria-label="Close search"
            >
              <X size={24} strokeWidth={1.4} aria-hidden="true" />
            </button>
          </div>
          <div id="search-instructions" className="sr-only">
            Use arrow keys to navigate search results, Enter to select
          </div>
        </form>

        {/* แสดงผลลัพธ์เหมือนกับ Navbar.tsx ทุกประการ */}
        {delayedQuery.length === 0 ? (
          <div className="w-full">
            <div className="xl:hidden">
              <div className="flex flex-col mt-6 md:mt-10 w-full max-w-2xl mx-auto px-4 space-y-14">
                <div className="px-1 md:px-0">
                  <h4 className="text-sm mb-3 font-semibold text-[#f8fcdc] tracking-wide">Main Menu</h4>
                  <ul className="space-y-2 text-xs sm:text-sm leading-relaxed" role="list">
                    {pageLinks.map((page, i) => {
                      const offsetIndex = 1 + i;
                      return (
                        <li
                          key={i}
                          ref={(el) => {
                            resultRefs.current[offsetIndex] = el;
                          }}
                          className={`transition-colors ${
                            highlightIndex === offsetIndex
                              ? 'text-[#dc9e63]'
                              : 'text-[#f8fcdc]/70 hover:text-[#dc9e63]'
                          }`}
                          role="listitem"
                        >
                          <Link
                            href={page.href}
                            onClick={() => setSearchOpen(false)}
                            className="block w-full"
                          >
                            {page.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {recentSearches.length > 0 && (
                  <div className="px-1 md:px-0">
                    <h4 className="text-sm mb-3 font-semibold text-[#f8fcdc] tracking-wide">Recent Searches</h4>
                    <ul className="space-y-2 text-xs sm:text-sm leading-relaxed" role="list">
                      {recentSearches.map((term, i) => (
                        <li
                          key={i}
                          className="cursor-pointer text-[#f8fcdc]/70 hover:text-[#dc9e63]"
                          onClick={() => setSearchQuery(term)}
                          role="listitem"
                        >
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden xl:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 w-full max-w-6xl mx-auto px-1 md:px-0">
                <div className="space-y-12">
                  <div className="text-[#f8fcdc]">
                    <h4 className="text-sm mb-3 font-semibold tracking-wide">Main Menu</h4>
                    <ul className="space-y-2 text-xs sm:text-sm leading-relaxed" role="list">
                      {pageLinks.map((page, i) => {
                        const offsetIndex = 1 + i;
                        return (
                          <li
                            key={i}
                            ref={(el) => {
                              resultRefs.current[offsetIndex] = el;
                            }}
                            className={`transition-colors ${
                              highlightIndex === offsetIndex
                                ? 'text-[#dc9e63]'
                                : 'text-[#f8fcdc]/70 hover:text-[#dc9e63]'
                            }`}
                            role="listitem"
                          >
                            <Link
                              href={page.href}
                              onClick={() => setSearchOpen(false)}
                              className="block w-full"
                            >
                              {page.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {recentSearches.length > 0 && (
                    <div className="text-[#f8fcdc]">
                      <h4 className="text-sm mb-3 font-semibold tracking-wide">Recent Searches</h4>
                      <ul className="space-y-2 text-xs sm:text-sm leading-relaxed" role="list">
                        {recentSearches.map((term, i) => (
                          <li
                            key={i}
                            className="cursor-pointer text-[#f8fcdc]/70 hover:text-[#dc9e63]"
                            onClick={() => setSearchQuery(term)}
                            role="listitem"
                          >
                            {term}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="xl:hidden">
              <div className="flex flex-col mt-6 md:mt-10 w-full max-w-2xl mx-auto px-4 space-y-14">
                <div className="text-[#f8fcdc]">
                  <h4 className="text-sm mb-3 font-semibold tracking-wide">Suggestions</h4>
                  <ul className="space-y-2 text-xs sm:text-sm leading-relaxed" role="list">
                    {suggestions.map((term, i) => {
                      const offsetIndex = 1 + filtered.length + i;
                      return (
                        <li
                          key={i}
                          ref={(el) => {
                            resultRefs.current[offsetIndex] = el;
                          }}
                          onClick={() => setSearchQuery(term)}
                          className={`cursor-pointer transition-colors ${
                            highlightIndex === offsetIndex
                              ? 'text-[#dc9e63]'
                              : 'text-[#f8fcdc]/70 hover:text-[#dc9e63]'
                          }`}
                          role="listitem"
                        >
                          {term}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm mb-3 font-semibold text-[#f8fcdc] tracking-wide">Products</h4>
                  {filtered.length === 0 ? (
                    <div className="mt-1">
                      <p className="text-xs text-[#f8fcdc]/40">No results found...</p>
                      <p className="text-xs text-[#f8fcdc]/40 mt-[2px]">Try searching with different keywords.</p>
                    </div>
                  ) : (
                    <div className="max-h-[240px] overflow-y-auto pr-2">
                      <ul role="list" className="space-y-2 md:space-y-3">
                        {filtered.map((item, i) => {
                          const offsetIndex = i + 1;
                          return (
                            <li
                              key={item.id}
                              ref={(el) => {
                                resultRefs.current[offsetIndex] = el;
                              }}
                              className={`flex items-center gap-2 md:gap-4 p-1.5 md:p-3 rounded-lg transition-colors cursor-pointer ${
                                highlightIndex === offsetIndex
                                  ? 'bg-[#dc9e63]/10'
                                  : 'hover:bg-[#dc9e63]/10'
                              }`}
                              role="listitem"
                            >
                              <Link
                                href={item.url}
                                onClick={() => {
                                  setSearchOpen(false);
                                  const q = searchQuery.trim();
                                  if (q.length > 0) {
                                    setRecentSearches((prev) => {
                                      const withoutDupes = prev.filter((t) => t !== q);
                                      return [q, ...withoutDupes].slice(0, 5);
                                    });
                                  }
                                }}
                                className="flex items-center gap-2 md:gap-4 w-full"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 object-cover rounded"
                                  loading="lazy"
                                  quality={75}
                                  sizes="48px"
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-[#f8fcdc]">
                                    {item.title}
                                  </span>
                                  <span className="text-xs text-[#f8fcdc]/70">{item.subtitle}</span>
                                  {item.price && (
                                    typeof item.price === 'object' ? (
                                      <div className="flex items-center gap-1 md:gap-2 text-xs mt-1">
                                        <span className="line-through text-[#f8fcdc]/40">
                                          ${item.price.original.toFixed(2)}
                                        </span>
                                        <span className="text-[#dc9e63]">
                                          ${item.price.sale.toFixed(2)}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="text-xs text-[#dc9e63] mt-1">
                                        ${item.price.toFixed(2)}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                {pageMatches.length > 0 && (
                  <div className="text-[#f8fcdc]">
                    <h4 className="text-sm mb-2 font-semibold">Pages</h4>
                    <ul className="space-y-2 text-xs sm:text-sm leading-relaxed" role="list">
                      {pageMatches.map((page, i) => {
                        const offsetIndex = 1 + filtered.length + suggestions.length + i;
                        return (
                          <li
                            key={i}
                            ref={(el) => {
                              resultRefs.current[offsetIndex] = el;
                            }}
                            className={`transition-colors ${
                              highlightIndex === offsetIndex
                                ? 'text-[#dc9e63]'
                                : 'text-[#f8fcdc]/70 hover:text-[#dc9e63]'
                            }`}
                            role="listitem"
                          >
                            <Link
                              href={page.href}
                              onClick={() => setSearchOpen(false)}
                              className="block w-full"
                            >
                              {page.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden xl:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 w-full max-w-6xl mx-auto px-1 md:px-0">
                <div className="space-y-12">
                  <div className="text-[#f8fcdc]">
                    <h4 className="text-sm mb-3 font-semibold tracking-wide">Suggestions</h4>
                    <ul className="space-y-2 text-xs sm:text-sm leading-relaxed" role="list">
                      {suggestions.map((term, i) => {
                        const offsetIndex = 1 + filtered.length + i;
                        return (
                          <li
                            key={i}
                            ref={(el) => {
                              resultRefs.current[offsetIndex] = el;
                            }}
                            onClick={() => setSearchQuery(term)}
                            className={`cursor-pointer transition-colors ${
                              highlightIndex === offsetIndex
                                ? 'text-[#dc9e63]'
                                : 'text-[#f8fcdc]/70 hover:text-[#dc9e63]'
                            }`}
                            role="listitem"
                          >
                            {term}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {pageMatches.length > 0 && (
                    <div className="text-[#f8fcdc]">
                      <h4 className="text-sm mb-2 font-semibold">Pages</h4>
                      <ul className="space-y-2 text-xs sm:text-sm leading-relaxed" role="list">
                        {pageMatches.map((page, i) => {
                          const offsetIndex = 1 + filtered.length + suggestions.length + i;
                          return (
                            <li
                              key={i}
                              ref={(el) => {
                                resultRefs.current[offsetIndex] = el;
                              }}
                              className={`transition-colors ${
                                highlightIndex === offsetIndex
                                  ? 'text-[#dc9e63]'
                                  : 'text-[#f8fcdc]/70 hover:text-[#dc9e63]'
                              }`}
                              role="listitem"
                            >
                              <Link
                                href={page.href}
                                onClick={() => setSearchOpen(false)}
                                className="block w-full"
                              >
                                {page.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm mb-3 font-semibold text-[#f8fcdc] tracking-wide">Products</h4>
                  {filtered.length === 0 ? (
                    <div className="mt-1">
                      <p className="text-xs text-[#f8fcdc]/40">No results found...</p>
                      <p className="text-xs text-[#f8fcdc]/40 mt-[2px]">Try searching with different keywords.</p>
                    </div>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <ul role="list" className="space-y-3">
                        {filtered.map((item, i) => {
                          const offsetIndex = i + 1;
                          return (
                            <li
                              key={item.id}
                              ref={(el) => {
                                resultRefs.current[offsetIndex] = el;
                              }}
                              className={`flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
                                highlightIndex === offsetIndex
                                  ? 'bg-[#dc9e63]/10'
                                  : 'hover:bg-[#dc9e63]/10'
                              }`}
                              role="listitem"
                            >
                              <Link
                                href={item.url}
                                onClick={() => {
                                  setSearchOpen(false);
                                  const q = searchQuery.trim();
                                  if (q.length > 0) {
                                    setRecentSearches((prev) => {
                                      const withoutDupes = prev.filter((t) => t !== q);
                                      return [q, ...withoutDupes].slice(0, 5);
                                    });
                                  }
                                }}
                                className="flex items-center gap-4 w-full"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 object-cover rounded"
                                  loading="lazy"
                                  quality={75}
                                  sizes="48px"
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-[#f8fcdc]">
                                    {item.title}
                                  </span>
                                  <span className="text-xs text-[#f8fcdc]/70">{item.subtitle}</span>
                                  {item.price && (
                                    typeof item.price === 'object' ? (
                                      <div className="flex items-center gap-2 text-xs mt-1">
                                        <span className="line-through text-[#f8fcdc]/40">
                                          ${item.price.original.toFixed(2)}
                                        </span>
                                        <span className="text-[#dc9e63]">
                                          ${item.price.sale.toFixed(2)}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="text-xs text-[#dc9e63] mt-1">
                                        ${item.price.toFixed(2)}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      <div
        id="__layout"
        className={`min-h-screen w-full relative transition-opacity duration-500 ${
          menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${navbarDropdownOpen ? 'dropdown-active' : ''}`}
        style={{ 
  overflow: 'visible'
}}
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
              
              {/* Clean social media aria-labels */}
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

            {/* Footer Links */}
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

      {/* Navigation Hover Overlay - ค่อยๆ fade มืด */}
     <div 
        className="fixed inset-0 bg-black transition-all duration-700 ease-in-out z-40 pointer-events-none"
        style={{ 
           opacity: navbarDropdownOpen ? 0.75 : 0,
        visibility: navbarDropdownOpen ? 'visible' : 'hidden'
         }}
      />
     </>
  );
 }