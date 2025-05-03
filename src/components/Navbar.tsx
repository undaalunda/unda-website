/* Navbar.tsx */

'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // 🛒 เอาข้อมูลตะกร้ามาใช้

// Product list for search functionality
export const allItems = [
  // Merch
  { id: 'cat-scores-black', title: 'CAT SCORES T-SHIRT', category: 'Merch', subtitle: 'BLACK', price: 29.95, tags: ['t-shirt', 'black', 'shirt'], image: '/black-cats-scores-tee.png', url: '/shop/cat-scores-black' },
  { id: 'cat-scores-white', title: 'CAT SCORES T-SHIRT', category: 'Merch', subtitle: 'WHITE', price: 29.95, tags: ['t-shirt', 'white', 'shirt'], image: '/white-cats-scores-tee.png', url: '/shop/cat-scores-white' },
  { id: 'cat-to-the-moon', title: 'A CAT TO THE MOON', category: 'Merch', subtitle: 'STICKERS', price: 4.95, tags: ['sticker', 'cat'], image: '/a-cat-to-the-moon-stickers.png', url: '/shop/cat-to-the-moon' },
  { id: 'musician-cats', title: 'A MUSICIAN CATS', category: 'Merch', subtitle: 'STICKERS', price: 4.95, tags: ['sticker', 'cat'], image: '/a-musician-cats.png', url: '/shop/musician-cats' },
  { id: 'signed-keychain', title: 'UNDA ALUNDA', category: 'Merch', subtitle: 'SIGNED KEYCHAIN', price: 9.95, tags: ['keychain', 'signed'], image: '/unda-alunda-sign-keychain.png', url: '/shop/signed-keychain' },

  // Music
  { id: 'audio-digipak', title: 'DARK WONDERFUL WORLD', subtitle: 'DIGIPAK CD', category: 'Music', price: 24.95, tags: ['audio', 'cd', 'album'], image: '/audio-digipak-dww.png', url: '/shop/audio-digipak' },
  { id: 'live-cd', title: 'DARK WONDERFUL WORLD', subtitle: 'LIVE CD', category: 'Music', price: 14.95, tags: ['live', 'cd', 'album'], image: '/live-cd-dww.png', url: '/shop/live-cd' },
  { id: 'guitars-book', title: 'FULL GUITARS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: 49.95, tags: ['book', 'transcription', 'guitar'], image: '/full-guitars-transcription.png', url: '/shop/guitars-book' },
  { id: 'bass-book', title: 'FULL BASS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: 49.95, tags: ['book', 'transcription', 'bass'], image: '/full-bass-transcription.png', url: '/shop/bass-book' },
  { id: 'keys-book', title: 'FULL KEYS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: 49.95, tags: ['book', 'transcription', 'keys'], image: '/full-keys-transcription.png', url: '/shop/keys-book' },
  { id: 'drums-book', title: 'FULL DRUMS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: 49.95, tags: ['book', 'transcription', 'drums'], image: '/full-drums-transcription.png', url: '/shop/drums-book' },

  // Bundles
  { id: 'album-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'ALBUM MERCH BUNDLE', category: 'Bundles', price: { original: 64.85, sale: 51.88 }, tags: ['bundle', 'album', 'merch'], image: '/dark-wonderful-world-album-merch-bundle.png', url: '/shop/album-merch-bundle' },
  { id: 'book-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & MERCH BUNDLE', category: 'Bundles', price: { original: 84.85, sale: 67.88 }, tags: ['bundle', 'book', 'merch'], image: '/dark-wonderful-world-book-&-merch-bundle.png', url: '/shop/book-merch-bundle' },
  { id: 'book-bonus-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & BONUS MERCH BUNDLE', category: 'Bundles', price: { original: 94.75, sale: 75.80 }, tags: ['bundle', 'book', 'bonus'], image: '/dark-wonderful-world-book-&-bonus-merch-bundle.png', url: '/shop/book-bonus-bundle' },
  { id: 'dual-album-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'DUAL ALBUM MERCH BUNDLE', category: 'Bundles', price: { original: 109.75, sale: 87.80 }, tags: ['bundle', 'album', 'dual'], image: '/dark-wonderful-world-dual-album-merch-bundle.png', url: '/shop/dual-album-bundle' },
  { id: 'book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK BUNDLE', category: 'Bundles', price: { original: 74.90, sale: 59.92 }, tags: ['bundle', 'book'], image: '/dark-wonderful-world-book-bundle.png', url: '/shop/book-bundle' },
  { id: 'apparel-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'APPAREL & BOOK BUNDLE', category: 'Bundles', price: { original: 104.85, sale: 83.88 }, tags: ['bundle', 'apparel', 'book'], image: '/dark-wonderful-world-apparel-&-book-bundle.png', url: '/shop/apparel-book-bundle' },
  { id: 'sticker-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'STICKER & BOOK BUNDLE', category: 'Bundles', price: { original: 84.80, sale: 67.84 }, tags: ['bundle', 'sticker', 'book'], image: '/dark-wonderful-world-sticker-&-book-bundle.png', url: '/shop/sticker-book-bundle' },

  // Backing Tracks
  { id: 'anomic-drums', title: 'ANOMIC', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track', price: 7.95, tags: ['drums', 'track'], image: '/anomic-no-drums.jpg', url: '/shop/anomic-drums' },
  { id: 'jyy-guitars', title: 'JYY', subtitle: 'LEAD GUITAR BACKING TRACK', category: 'Backing Track', price: 7.95, tags: ['guitars', 'track'], image: '/jyy-no-guitars.jpg', url: '/shop/jyy-guitars' },
  { id: 'atlantic-guitar', title: 'ATLANTIC', subtitle: 'GUITARS BACKING TRACK', category: 'Backing Track', price: 8.95, tags: ['lead guitar', 'track'], image: '/atlantic-no-lead-guitar.jpg', url: '/shop/atlantic-guitar' },
  { id: 'out-dark-drums', title: 'OUT OF THE DARK', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track', price: 11.95, tags: ['drums', 'track'], image: '/out-of-the-dark-no-drums.jpg', url: '/shop/out-dark-drums' },
  { id: 'feign-guitars', title: 'FEIGN', subtitle: 'GUITARS BACKING TRACK', category: 'Backing Track', price: 11.95, tags: ['guitars', 'track'], image: '/feign-no-guitars.jpg', url: '/shop/feign-guitars' },
  { id: 'dark-keys', title: 'THE DARK', subtitle: 'KEYS BACKING TRACK', category: 'Backing Track', price: 4.95, tags: ['keys', 'track'], image: '/the-dark-no-keys.jpg', url: '/shop/dark-keys' },
  { id: 'reddown-bass', title: 'RED DOWN', subtitle: 'BASS BACKING TRACK', category: 'Backing Track', price: 7.95, tags: ['bass', 'track'], image: '/reddown-no-bass.jpg', url: '/shop/reddown-bass' },
  { id: 'quietness-bass', title: 'QUIETNESS', subtitle: 'BASS BACKING TRACK', category: 'Backing Track', price: 7.95, tags: ['bass', 'track'], image: '/quietness-no-bass.jpg', url: '/shop/quietness-bass' },
  ];

const pageLinks = [
  { title: 'Home', href: '/' },
  { title: 'Shop', href: '/shop' },
  { title: 'Music', href: '/music' },
  { title: 'About', href: '/about' },
  { title: 'Tour', href: '/tour' },
  { title: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [highlightIndex, setHighlightIndex] = useState<number>(0);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wasSearchOpen, setWasSearchOpen] = useState(false);
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
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        resultRefs.current[highlightIndex]?.click(); // click ไอเท็มที่กำลังชี้อยู่
      }
    };
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
    }
    const event = new CustomEvent('toggle-menu', { detail: menuOpen });
    window.dispatchEvent(event);
    return () => {
      body.style.position = '';
      body.style.top = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const body = document.body;
    if (searchOpen) {
      scrollYRef.current = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollYRef.current}px`;
      body.style.width = '100%';
    } else {
      body.style.position = '';
      body.style.top = '';
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      body.style.position = '';
      body.style.top = '';
    };
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery === '') {
      setDelayedQuery('');
    } else {
      const handler = setTimeout(() => setDelayedQuery(searchQuery), 300);
      return () => clearTimeout(handler);
    }
  }, [searchQuery]);

  const filtered = useMemo(() => {
    const q = delayedQuery.toLowerCase();
    return q.length > 0
      ? allItems.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.subtitle?.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.tags.some((tag) => tag.toLowerCase().includes(q))
        )
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

  const hasLeftContent = suggestions.length > 0 || pageMatches.length > 0;

  if (!hasMounted) return null;
  const isHomepage = pathname === '/';

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-[96px]">
      <div className={`absolute inset-0 bg-[#160000] transition-opacity duration-[1200ms] pointer-events-none ${scrolledDown ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative flex items-center justify-between px-4 py-8 h-full">
        
        {/* ✅ ซ่อน hamburger ตอน searchOpen === true */}
        {!searchOpen && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors z-50"
          >
            <div
              className={`transition-transform duration-200 ease-in-out ${
                menuOpen ? 'rotate-180 scale-100' : 'rotate-0 scale-100'
              }`}
            >
              {menuOpen ? <X size={28} strokeWidth={1.2} /> : <Menu size={23} strokeWidth={1.2} />}
            </div>
          </button>
        )}
  
        {/* ✅ ซ่อน icons ตอน menuOpen === true */}
        {!menuOpen && (
  <div className="flex items-center gap-6 pr-1 z-40">
    <Link
      href="/account"
      className="hidden md:block cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
    >
      <User size={23} strokeWidth={1.2} />
    </Link>

    <Link
  href="/cart"
  className="relative cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
>
  <ShoppingCart size={23} strokeWidth={1.2} />
  {totalQuantity > 0 && (
    <span className="absolute -top-2 -right-2 bg-[#dc9e63] text-[#160000] rounded-full w-5 h-5 flex items-center justify-center text-xs font-light">
      {totalQuantity}
    </span>
  )}
</Link>

    <button
      onClick={() => setSearchOpen(true)}
      className="hidden md:block cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors"
    >
      <Search size={23} strokeWidth={1.2} />
    </button>
  </div>
)}
  
        {/* Logo กลาง */}
        <div
  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-opacity duration-[1200ms] ${
    scrolledDown || !isHomepage ? 'opacity-100' : 'opacity-0'
  }`}
>
  <Link href="/" className="block">
    <Image
      src="/unda-alunda-header.png"
      alt="Unda Alunda Logo"
      width={180}
      height={50}
      className="mx-auto logo-navbar-img cursor-pointer"
      priority
    />
  </Link>
</div>

{menuOpen && (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]">
    <Link href="/" onClick={() => setMenuOpen(false)}>
      <Image
        src="/unda-alunda-header.png"
        alt="Unda Alunda Logo"
        width={200}
        height={60}
        className="logo-navbar-img cursor-pointer"
        priority
      />
    </Link>
  </div>
)}

</div> {/* ปิด container หลัก */}

{/* MENU OPEN OVERLAY */}
{menuOpen && (
  <div className="fixed inset-0 bg-transparent flex flex-col items-center justify-center text-[#f8fcdc] text-lg font-semibold tracking-widest space-y-6 z-30 backdrop-blur-none font-[Cinzel]">
    <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">HOME</Link>
    <Link href="/shop" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">SHOP</Link>
    <Link href="/music" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">MUSIC</Link>
    <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">ABOUT</Link>
    <Link href="/tour" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">TOUR</Link>
    <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-[#dc9e63]">CONTACT</Link>
  </div>
)}

{/* SEARCH OPEN OVERLAY */}
{searchOpen && (
  <div className="fixed inset-0 z-40 bg-[#0d0d0dea] flex items-start justify-center px-4 pt-40">
    <div ref={searchOverlayRef} className="w-full max-w-5xl flex flex-col items-center">
      
      {/* SEARCH INPUT */}
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
      >
        <div className="relative">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[#f8fcdc]/50">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-12 py-2 text-base text-[#f8fcdc] caret-[#dc9e63] bg-transparent border border-[#dc9e63] rounded-md placeholder:text-[#777] outline-none"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#f8fcdc] hover:text-[#dc9e63] transition"
          >
            <X size={24} strokeWidth={1.4} />
          </button>
        </div>
      </form>

      {/* SEARCH RESULTS */}
      {delayedQuery.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6 w-full max-w-5xl mx-auto">
          {/* LEFT - MAIN MENU */}
          <div>
            <h4 className="text-sm mb-2 font-semibold text-[#f8fcdc]">Main Menu</h4>
            <ul className="space-y-1 text-sm">
              {pageLinks.map((page, i) => (
                <li key={i}>
                  <Link href={page.href} onClick={() => setSearchOpen(false)} className="hover:text-[#dc9e63] text-[#f8fcdc]/70">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT - RECENT SEARCH */}
          {recentSearches.length > 0 && (
            <div>
              <h4 className="text-sm mb-2 font-semibold text-[#f8fcdc]">Recent Searches</h4>
              <ul className="space-y-1 text-sm">
                {recentSearches.map((term, i) => (
                  <li
                    key={i}
                    className="cursor-pointer text-[#f8fcdc]/70 hover:text-[#dc9e63]"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6 w-full max-w-5xl mx-auto">
            {/* LEFT - Suggestions */}
            <div className="text-[#f8fcdc]">
              <h4 className="text-sm mb-2 font-semibold">Suggestions</h4>
              <ul className="space-y-1 text-sm">
                {suggestions.map((term, i) => (
                  <li
                    key={i}
                    className="cursor-pointer hover:text-[#dc9e63] text-[#f8fcdc]/70"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </li>
                ))}
              </ul>

              {/* Pages */}
              {pageMatches.length > 0 && (
                <div className="text-[#f8fcdc] mt-6">
                  <h4 className="text-sm mb-2 font-semibold">Pages</h4>
                  <ul className="space-y-1 text-sm">
                    {pageMatches.map((page, i) => (
                      <li key={i}>
                        <Link
                          href={page.href}
                          onClick={() => setSearchOpen(false)}
                          className="hover:text-[#dc9e63] text-[#f8fcdc]/70"
                        >
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT - Products */}
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
              <h4 className="text-sm mb-2 font-semibold text-[#f8fcdc]">Products</h4>
              {filtered.length === 0 ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-[#f8fcdc]/60">No results found...</p>
                  <p className="text-xs text-[#f8fcdc]/40 mt-[2px]">
                    Try searching with different keywords.
                  </p>
                </div>
              ) : (
                filtered.map((item) => (
                  <Link
                    href={item.url}
                    key={item.id}
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
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#dc9e63]/10 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded opacity-0 transition-opacity duration-500"
                      onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#f8fcdc]">{item.title}</span>
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
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}
   </header>
  );
}