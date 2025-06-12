/* Navbar.tsx - Performance Optimized + Fixed Accessibility + Search in Menu */

'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { allItems } from '@/components/allItems';

const pageLinks = [
  { title: 'Home', href: '/' },
  { title: 'Shop', href: '/shop' },
  { title: 'About', href: '/about' },
  { title: 'Tour', href: '/tour' },
  { title: 'Contact', href: '/contact' },
];

// 🚀 สร้าง LogoImage component แยกเพื่อลดการซ้ำซ้อน
const LogoImage = ({ onClick }: { onClick?: () => void }) => (
  <Image
    src="/unda-alunda-header.webp"
    alt="Unda Alunda Logo"
    width={200}
    height={50}
    quality={100}
    priority
    unoptimized={true}
    sizes="(max-width: 1279px) 150px, 200px"
    onClick={onClick}
    className="logo-navbar-img"
  />
);

export default function Navbar() {
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const resultRefs = useRef<(HTMLElement | null)[]>([]);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wasSearchOpen, setWasSearchOpen] = useState(false);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [delayedQuery, setDelayedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const pathname = usePathname();
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const scrollYMenuRef = useRef(0);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => setScrolledDown(window.scrollY > 10);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchOverlayRef.current &&
        !searchOverlayRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
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
      // บันทึกตำแหน่ง scroll แต่ไม่ lock body
      scrollYRef.current = window.scrollY;
      // แค่ซ่อน scrollbar ของ body
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
      // กลับไปตำแหน่งเดิมเมื่อปิด search
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      body.style.overflow = '';
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
    <header className="fixed top-0 left-0 w-full z-50 h-[96px]">
      <div className={`absolute inset-0 bg-[#160000] transition-opacity duration-[1200ms] pointer-events-none ${scrolledDown ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative flex items-center justify-between px-4 py-8 h-full">
        
        {/* ✅ Fixed hamburger menu button - ซ่อน ตอน searchOpen === true */}
        {!searchOpen && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors z-50"
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
  
        {/* ✅ Updated: Cart และ Search buttons - แสดงตามเงื่อนไขใหม่ */}
        {!searchOpen && (
          <div className="flex items-center gap-7 pr-3 z-40">
            {/* Cart button - ซ่อนตอนเปิด menu */}
            {!menuOpen && (
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
            )}

            {/* Search button - แสดงทั้งตอนปกติ (desktop only) และตอนเปิด menu (ทุกอุปกรณ์) */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`${
                menuOpen ? 'block z-[70]' : 'hidden md:block'
              } cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors`}
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
  
        {/* 🚀 Logo กลาง - ปรับปรุงแล้ว ไม่ซ้ำ */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[1200ms] ${
            menuOpen ? 'z-[60]' : 'z-40'
          } ${
            scrolledDown || !isHomepage || menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link 
            href="/" 
            className="block"
            onClick={menuOpen ? () => setMenuOpen(false) : undefined}
            aria-label="Unda Alunda - Go to homepage"
          >
            <LogoImage />
          </Link>
        </div>
      </div>

      {/* ✅ Fixed MENU OPEN OVERLAY */}
      {menuOpen && (
        <nav 
          id="main-navigation"
          className="fixed inset-0 bg-transparent flex flex-col items-center justify-center text-[#f8fcdc] text-lg font-semibold tracking-widest space-y-6 z-30 backdrop-blur-none font-[Cinzel]"
          aria-label="Main navigation"
        >
          <Link 
            href="/" 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-[#dc9e63]"
          >
            HOME
          </Link>
          <Link 
            href="/shop" 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-[#dc9e63]"
          >
            SHOP
          </Link>
          
          {/* ✅ Fixed MUSIC DROPDOWN MENU */}
          <div className="flex flex-col items-center z-30 font-[Cinzel] w-full">
            <button
              onClick={() => setMusicDropdownOpen(!musicDropdownOpen)}
              className="hover:text-[#dc9e63] text-[#f8fcdc] text-lg font-semibold tracking-widest cursor-pointer"
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
              <a 
                href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#dc9e63]"
                role="menuitem"
                aria-label="Listen on Spotify"
              >
                Spotify
              </a>
              <a 
                href="https://music.apple.com/us/artist/unda-alunda/1543677299" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#dc9e63]"
                role="menuitem"
                aria-label="Listen on Apple Music"
              >
                Apple
              </a>
              <a 
                href="https://www.deezer.com/en/artist/115903802" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#dc9e63]"
                role="menuitem"
                aria-label="Listen on Deezer"
              >
                Deezer
              </a>
              <a 
                href="https://tidal.com/browse/artist/22524871" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#dc9e63]"
                role="menuitem"
                aria-label="Listen on Tidal"
              >
                Tidal
              </a>
              <a 
                href="https://music.amazon.com/artists/B08PVKFZDZ/unda-alunda" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#dc9e63]"
                role="menuitem"
                aria-label="Listen on Amazon Music"
              >
                Amazon
              </a>
            </div>
          </div>
          
          <Link 
            href="/about" 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-[#dc9e63]"
          >
            ABOUT
          </Link>
          <Link 
            href="/tour" 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-[#dc9e63]"
          >
            TOUR
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-[#dc9e63]"
          >
            CONTACT
          </Link>
        </nav>
      )}

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
            {/* ✅ Fixed SEARCH INPUT - เอา outline ออก */}
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
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#f8fcdc] hover:text-[#dc9e63] transition"
                  aria-label="Close search"
                >
                  <X size={24} strokeWidth={1.4} aria-hidden="true" />
                </button>
              </div>
              <div id="search-instructions" className="sr-only">
                Use arrow keys to navigate search results, Enter to select
              </div>
            </form>

            {/* SEARCH RESULTS */}
            {delayedQuery.length === 0 ? (
              <div className="w-full">
                {/* Mobile & Tablet (0-1279px): แนวตั้ง */}
                <div className="xl:hidden">
                  <div className="flex flex-col mt-6 md:mt-10 w-full max-w-2xl mx-auto px-4 space-y-14">
                    
                    {/* MAIN MENU - Mobile/Tablet */}
                    <div className="px-1 md:px-0">
                      <h4 className="text-sm mb-2 font-semibold text-[#f8fcdc]">Main Menu</h4>
                      <ul className="space-y-1 text-xs sm:text-sm" role="list">
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
                        <h4 className="text-sm mb-2 font-semibold text-[#f8fcdc]">Recent Searches</h4>
                        <ul className="space-y-1 text-xs sm:text-sm" role="list">
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
                        <h4 className="text-sm mb-2 font-semibold">Main Menu</h4>
                        <ul className="space-y-1 text-xs sm:text-sm" role="list">
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
                          <h4 className="text-sm mb-2 font-semibold">Recent Searches</h4>
                          <ul className="space-y-1 text-xs sm:text-sm" role="list">
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
                      <h4 className="text-sm mb-2 font-semibold">Suggestions</h4>
                      <ul className="space-y-1 text-xs sm:text-sm" role="list">
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
                      <h4 className="text-sm mb-2 font-semibold text-[#f8fcdc]">Products</h4>
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
                        <ul className="space-y-1 text-xs sm:text-sm" role="list">
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
                        <h4 className="text-sm mb-2 font-semibold">Suggestions</h4>
                        <ul className="space-y-1 text-xs sm:text-sm" role="list">
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
                          <ul className="space-y-1 text-xs sm:text-sm" role="list">
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
                      <h4 className="text-sm mb-2 font-semibold text-[#f8fcdc]">Products</h4>
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