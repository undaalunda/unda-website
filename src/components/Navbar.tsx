/* Navbar.tsx - Desktop Navigation Menu for ≥1280px */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSearch } from '@/hooks/useSearch'; // 🎯 ใช้ custom hook
import SearchOverlay from '@/components/SearchOverlay'; // 🎯 แยก component
import MusicDropdown from '@/components/MusicDropdown'; // 🎯 แยก component

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
  const [scrolledDown, setScrolledDown] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const [wasSearchOpen, setWasSearchOpen] = useState(false);
  
  const { cartItems } = useCart();
  const pathname = usePathname();
  
  // 🎯 ใช้ custom hook แทนการเขียนซ้ำ
  const search = useSearch();
  
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isHomepage = pathname === '/';

  // 🎯 รวม useEffect หลายตัวเป็นตัวเดียว
  useEffect(() => {
    setHasMounted(true);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolledDown(currentScrollY > 120);
      setIsAtTop(currentScrollY === 0);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        search.closeSearch();
        setMusicDropdownOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (search.searchOverlayRef.current && 
          !search.searchOverlayRef.current.contains(e.target as Node)) {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) search.closeSearch();
      }
    };

    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      if (isSmallScreen && search.searchOpen) {
        setWasSearchOpen(true);
        search.closeSearch();
      }
      if (!isSmallScreen && wasSearchOpen) {
        search.openSearch();
        setWasSearchOpen(false);
      }
    };

    const handleMenuToggle = (e: CustomEvent) => {
      setMenuOpen(e.detail);
    };

    // Add all event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
    window.addEventListener('toggle-menu', handleMenuToggle as EventListener);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('toggle-menu', handleMenuToggle as EventListener);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [search, wasSearchOpen]);

  // Menu body scroll lock
  useEffect(() => {
    const body = document.body;
    let scrollYMenuRef = 0;
    
    if (menuOpen) {
      scrollYMenuRef = window.scrollY;
      body.style.top = `-${scrollYMenuRef}px`;
      body.style.position = 'fixed';
      body.style.width = '100%';
    } else {
      body.style.position = '';
      body.style.top = '';
      window.scrollTo(0, scrollYMenuRef);
      setMusicDropdownOpen(false);
    }

    const event = new CustomEvent('toggle-menu', { detail: menuOpen });
    window.dispatchEvent(event);
    
    return () => {
      body.style.position = '';
      body.style.top = '';
    };
  }, [menuOpen]);

  if (!hasMounted) return null;

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 h-[96px] transition-opacity duration-0 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className={`absolute inset-0 bg-[#160000] transition-opacity duration-[1200ms] pointer-events-none ${scrolledDown ? 'opacity-100' : 'opacity-0'}`} />
        <div className="relative flex items-center justify-between px-4 py-8 h-full">

          {/* 🔥 DESKTOP NAVIGATION - ≥1280px */}
          <div className="hidden xl:flex items-center justify-between w-full">
            <div className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-[800ms] ${
              !isHomepage || scrolledDown || menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              
              {/* Left Navigation */}
              {!search.searchOpen && (
                <nav className={`flex items-center gap-8 ml-4 transition-opacity duration-[800ms] ${
                  !isHomepage ? 'opacity-100' : (scrolledDown ? 'opacity-100' : 'opacity-0 pointer-events-none')
                }`} style={{ transform: 'translateY(2px)' }} aria-label="Main navigation">
                  
                  <Link href="/" className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase" style={{ letterSpacing: '0.25em' }}>HOME</Link>
                  <Link href="/shop" className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase" style={{ letterSpacing: '0.25em' }}>SHOP</Link>
                  
                  {/* 🎯 ใช้ component แยก */}
                  <MusicDropdown 
                    isOpen={musicDropdownOpen}
                    setIsOpen={setMusicDropdownOpen}
                  />
                  
                  <Link href="/about" className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase" style={{ letterSpacing: '0.25em' }}>ABOUT</Link>
                  <Link href="/tour" className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase" style={{ letterSpacing: '0.25em' }}>TOUR</Link>
                  <Link href="/contact" className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase" style={{ letterSpacing: '0.25em' }}>CONTACT</Link>
                </nav>
              )}

              {/* Center Logo */}
              <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[800ms] ${
                !isHomepage || scrolledDown || menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <Link href="/" className="block" aria-label="Unda Alunda - Go to homepage">
                  <LogoImage />
                </Link>
              </div>

              {/* Right Cart & Search */}
              {!search.searchOpen && (
                <div className={`flex items-center gap-7 xl:gap-9 -translate-x-4 transition-opacity duration-[800ms] ${
                  !isHomepage ? 'opacity-100' : (scrolledDown ? 'opacity-100' : 'opacity-0 pointer-events-none')
                }`}>
                  <Link href="/cart" className="relative cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors" aria-label={`Shopping cart with ${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`}>
                    <ShoppingCart size={23} strokeWidth={1.2} className="transition-opacity duration-300 opacity-70 hover:opacity-100" aria-hidden="true" />
                    {totalQuantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#dc9e63] text-[#160000] rounded-full w-5 h-5 flex items-center justify-center text-xs font-light" aria-hidden="true">
                        {totalQuantity}
                      </span>
                    )}
                  </Link>
                  <button onClick={search.openSearch} className="cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors" aria-label="Open search">
                    <Search size={23} strokeWidth={1.2} className="transition-opacity duration-300 opacity-70 hover:opacity-100" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 🔥 MOBILE/TABLET LAYOUT - <1280px */}
          <div className="xl:hidden w-full">
            <div className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-[800ms] ${
              !isHomepage || scrolledDown || menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              
              {/* Hamburger Button */}
              {!search.searchOpen && (
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-all duration-[1200ms] z-50 transition-opacity duration-[800ms] ${
                    !isHomepage ? 'opacity-100' : (scrolledDown ? 'opacity-100' : 'opacity-0 pointer-events-none')
                  }`}
                  aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={menuOpen}
                  aria-controls="main-navigation"
                >
                  <div className={`transition-transform duration-200 ease-in-out ${menuOpen ? 'rotate-180 scale-100' : 'rotate-0 scale-100'}`}>
                    {menuOpen ? <X size={28} strokeWidth={1.2} aria-hidden="true" /> : <Menu size={23} strokeWidth={1.2} className="transition-opacity duration-300 opacity-70 hover:opacity-100" aria-hidden="true" />}
                  </div>
                </button>
              )}

              {/* Center Logo */}
              <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[800ms] z-40 ${
                menuOpen ? 'opacity-100' : search.searchOpen ? 'md:opacity-100 opacity-0' : (!isHomepage ? 'opacity-100' : (isHomepage && !scrolledDown) ? 'opacity-0 pointer-events-none' : 'opacity-100')
              }`}>
                <Link href="/" className="block" onClick={menuOpen ? () => setMenuOpen(false) : undefined} aria-label="Unda Alunda - Go to homepage">
                  <Image src="/unda-alunda-header.webp" alt="Unda Alunda Logo" width={180} height={45} quality={100} priority unoptimized={true} sizes="(max-width: 768px) 120px, 180px" className="w-[150px] md:w-[180px] h-auto object-contain" />
                </Link>
              </div>
            </div>

            {/* Cart & Search - Mobile */}
            {!search.searchOpen && !menuOpen && (
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-7 -translate-x-4 z-40 transition-opacity duration-[800ms] ${
                !isHomepage ? 'opacity-100' : (scrolledDown ? 'opacity-100' : 'opacity-0 pointer-events-none')
              }`}>
                <Link href="/cart" className="relative cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors" aria-label={`Shopping cart with ${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`}>
                  <ShoppingCart size={23} strokeWidth={1.2} className="transition-opacity duration-300 opacity-70 hover:opacity-100" aria-hidden="true" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#dc9e63] text-[#160000] rounded-full w-5 h-5 flex items-center justify-center text-xs font-light" aria-hidden="true">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
                <button onClick={search.openSearch} className="hidden md:block cursor-pointer text-[#f8fcdc]/60 hover:text-[#dc9e63] transition-colors" aria-label="Open search">
                  <Search size={23} strokeWidth={1.2} className="transition-opacity duration-300 opacity-70 hover:opacity-100" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🎯 ใช้ component แยก - ไม่ต้องเขียน JSX ยาวๆ ใน main file */}
      {search.searchOpen && <SearchOverlay onClose={search.closeSearch} />}
    </>
  );
}