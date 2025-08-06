/* Navbar.tsx - Desktop Navigation Menu for ≥1280px */

'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ShoppingCart, Search, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { allItems } from '@/components/allItems';

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

// 🚀 Logo Component สำหรับ Navbar (2 responsive + mobile image)
const LogoImage = ({ onClick }: { onClick?: () => void }) => (
  <Image
    src="/unda-alunda-header.webp"
    alt="Unda Alunda Logo"
    width={180}
    height={45}
    quality={100}
    priority
    unoptimized={true}
    sizes="(max-width: 768px) 120px, 180px"
    onClick={onClick}
    className="logo-navbar-img"
  />
);

export default function Navbar() {
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const resultRefs = useRef<(HTMLElement | null)[]>([]);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wasSearchOpen, setWasSearchOpen] = useState(false);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const [desktopMusicDropdownOpen, setDesktopMusicDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [delayedQuery, setDelayedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const pathname = usePathname();
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const desktopMusicRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const scrollYMenuRef = useRef(0);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolledDown(currentScrollY > 120);
      setIsAtTop(currentScrollY === 0);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDesktopMusicDropdownOpen(false);
      }
    };
    
    // 🎯 Updated: Mobile-aware click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchOverlayRef.current &&
        !searchOverlayRef.current.contains(e.target as Node)
      ) {
        // 📱 Only close on click outside for desktop/tablet (768px+)
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
          setSearchOpen(false);
        }
      }
      
      // Desktop music dropdown click outside
      if (
        desktopMusicRef.current &&
        !desktopMusicRef.current.contains(e.target as Node)
      ) {
        setDesktopMusicDropdownOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && resultRefs.current[highlightIndex]) {
      resultRefs.current[highlightIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex, searchOpen]);

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      if (isSmallScreen && searchOpen) {
        setWasSearchOpen(true);
        setSearchOpen(false);
      }
      if (!isSmallScreen && wasSearchOpen) {
        setSearchOpen(true);
        setWasSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [searchOpen, wasSearchOpen]);

  useEffect(() => {
    const body = document.body;
    if (menuOpen) {
      scrollYMenuRef.current = window.scrollY;
      body.style.top = `-${scrollYMenuRef.current}px`;
      body.style.position = 'fixed';
      body.style.width = '100%';
    } else {
      body.style.position = '';
      body.style.top = '';
      window.scrollTo(0, scrollYMenuRef.current);
      setMusicDropdownOpen(false);
    }
    const event = new CustomEvent('toggle-menu', { detail: menuOpen });
    window.dispatchEvent(event);
    return () => {
      body.style.position = '';
      body.style.top = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) {
      setHighlightIndex(0);
    }
  }, [searchOpen]);

  useEffect(() => {
    const body = document.body;
    if (searchOpen) {
      // เก็บตำแหน่ง scroll และ lock background
      scrollYRef.current = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollYRef.current}px`;  
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    } else {
      // ปลดล็อค background และกลับไปตำแหน่งเดิม
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, scrollYRef.current);
    }
    
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';  
      body.style.width = '';
    };
  }, [searchOpen]);

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
  const handleMenuToggle = (e: CustomEvent) => {
    console.log('Navbar received menu toggle:', e.detail);
    setMenuOpen(e.detail);
  };
  
  window.addEventListener('toggle-menu', handleMenuToggle as EventListener);
  
  return () => {
    window.removeEventListener('toggle-menu', handleMenuToggle as EventListener);
  };
}, []);
  

  const filtered = useMemo(() => {
    const q = delayedQuery.toLowerCase().trim();
    const queryWords = q.split(/\s+/); // แยก query เป็นคำๆ

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

          // ✅ ตรวจว่า "ทุกคำที่พิมพ์มา" ต้อง match กับ field อะไรก็ได้
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

  if (!hasMounted) return null;
  const isHomepage = pathname === '/';

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
    <header className={`fixed top-0 left-0 w-full z-50 h-[96px] transition-opacity duration-0 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className={`absolute inset-0 bg-[#160000] transition-opacity duration-[1200ms] pointer-events-none ${scrolledDown ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative flex items-center justify-between px-4 py-8 h-full">

        {/* 🔥 DESKTOP NAVIGATION - ≥1280px */}
        <div className="hidden xl:flex items-center justify-between w-full">
        

          {/* CENTER LAYOUT - Normal layout (fade in เมื่อ scroll ลง) */}
          <div className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-[800ms] ${
  !isHomepage || scrolledDown || menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
}`}>
            {/* Left side: Navigation menu only */}
{!searchOpen && (
  <nav className={`flex items-center gap-8 ml-4 transition-opacity duration-[800ms] ${
    !isHomepage ? 'opacity-100' : (scrolledDown ? 'opacity-100' : 'opacity-0 pointer-events-none')
  }`} style={{ transform: 'translateY(2px)' }} aria-label="Main navigation">
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
                    // 🆕 ส่ง signal ไป HomePage
                    window.dispatchEvent(new CustomEvent('navbar-dropdown-toggle', { detail: true }));
                  }}
                  onMouseLeave={() => {
                    setDesktopMusicDropdownOpen(false);
                    // 🆕 ส่ง signal ไป HomePage
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
            )}

            {/* Logo กลาง */}
<div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[800ms] ${
  !isHomepage || scrolledDown || menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
}`}>      <Link 
                href="/" 
                className="block"
                aria-label="Unda Alunda - Go to homepage"
              >
                <LogoImage />
              </Link>
            </div>

            {/* Right side: Cart + Search */}
            {!searchOpen && (
  <div className={`flex items-center gap-7 xl:gap-9 -translate-x-4 transition-opacity duration-[800ms] ${
    !isHomepage ? 'opacity-100' : (scrolledDown ? 'opacity-100' : 'opacity-0 pointer-events-none')
  }`}>
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
              )}
            </div>
        </div>

        {/* 🔥 MOBILE/TABLET LAYOUT - <1280px */}
        <div className="xl:hidden w-full">
          

          {/* CENTER LAYOUT - Normal layout (fade in เมื่อ scroll ลง) */}
          <div className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-[800ms] ${
  !isHomepage || scrolledDown || menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
}`}>
            {/* Hamburger menu button - ซ้าย */}
            {!searchOpen && (
  <button 
    onClick={() => setMenuOpen(!menuOpen)}
    className={`cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-all duration-[1200ms] z-50 transition-opacity duration-[800ms] ${
      !isHomepage ? 'opacity-100' : (scrolledDown ? 'opacity-100' : 'opacity-0 pointer-events-none')
    }`}
    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
    aria-expanded={menuOpen}
    aria-controls="main-navigation"
  >
                <div
                  className={`transition-transform duration-200 ease-in-out ${
                    menuOpen ? 'rotate-180 scale-100' : 'rotate-0 scale-100'
                  }`}
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
            )}

            {/* 🎯 FIXED: Logo กลาง - แสดงเสมอเมื่อเปิด menu */}
            <div
             className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[800ms] z-40 ${
  menuOpen ? 'opacity-100' : searchOpen ? 'md:opacity-100 opacity-0' : (!isHomepage ? 'opacity-100' : (isHomepage && !scrolledDown) ? 'opacity-0 pointer-events-none' : 'opacity-100')
}`}
            >
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
                  className="w-[150px] md:w-[180px] h-auto object-contain"
                />
              </Link>
            </div>
          </div>

          {/* 🔥 CART & SEARCH - แสดงตลอดไม่ fade (ซ่อนเมื่อเปิด menu) - 🎯 gap เหมือนกันทุก responsive */}
          {!searchOpen && !menuOpen && (
 <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-7 -translate-x-4 z-40 transition-opacity duration-[800ms] ${
  !isHomepage ? 'opacity-100' : (scrolledDown ? 'opacity-100' : 'opacity-0 pointer-events-none')
}`}>
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

      {/* ✅ SEARCH OPEN OVERLAY - Full Page Scroll */}
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
            {/* ✅ SEARCH INPUT */}
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

            {/* SEARCH RESULTS - (keeping the same search results layout as version 1) */}
            {delayedQuery.length === 0 ? (
              <div className="w-full">
                {/* Mobile & Tablet (0-1279px): แนวตั้ง */}
                <div className="xl:hidden">
                  <div className="flex flex-col mt-6 md:mt-10 w-full max-w-2xl mx-auto px-4 space-y-14">
                    
                    {/* MAIN MENU - Mobile/Tablet */}
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

                    {/* RECENT SEARCH - Mobile/Tablet */}
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

                {/* Desktop (1280px+): 2 คอลัมน์ */}
                <div className="hidden xl:block">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 w-full max-w-6xl mx-auto px-1 md:px-0">
                    
                    {/* Left Column: Main Menu + Recent Searches */}
                    <div className="space-y-12">
                      {/* MAIN MENU - Desktop Left Column */}
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

                      {/* RECENT SEARCHES - Desktop Left Column */}
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

                    {/* Right Column: Empty placeholder or future content */}
                    <div>
                      {/* This column can be used for other content when no search query */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {/* Mobile & Tablet (0-1279px): แนวตั้ง */}
                <div className="xl:hidden">
                  <div className="flex flex-col mt-6 md:mt-10 w-full max-w-2xl mx-auto px-4 space-y-14">
                    
                    {/* 1. Suggestions */}
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

                    {/* 2. Products */}
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
                                  ref={(el: HTMLLIElement | null) => {
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
                                    aria-label={`${item.title} - ${item.subtitle}`}
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

                    {/* 3. Pages */}
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

                {/* Desktop (1280px+): 2 คอลัมน์ */}
                <div className="hidden xl:block">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 w-full max-w-6xl mx-auto px-1 md:px-0">
                    
                    {/* Left Column: Suggestions + Pages */}
                    <div className="space-y-12">
                      {/* 1. Suggestions */}
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

                      {/* 3. Pages */}
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

                    {/* Right Column: Products Only */}
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
                                  ref={(el: HTMLLIElement | null) => {
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
                                    aria-label={`${item.title} - ${item.subtitle}`}
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
    </header>
  );
}