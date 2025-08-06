// components/MusicDropdown.tsx
'use client';

import { useRef, useEffect } from 'react';

// Music streaming platforms
const musicLinks = [
  { title: 'Spotify', href: 'https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0' },
  { title: 'Apple', href: 'https://music.apple.com/us/artist/unda-alunda/1543677299' },
  { title: 'Deezer', href: 'https://www.deezer.com/en/artist/115903802' },
  { title: 'Tidal', href: 'https://tidal.com/browse/artist/22524871' },
  { title: 'Amazon', href: 'https://music.amazon.com/artists/B08PVKFZDZ/unda-alunda' },
];

interface MusicDropdownProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MusicDropdown({ isOpen, setIsOpen }: MusicDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => {
        setIsOpen(true);
        window.dispatchEvent(new CustomEvent('navbar-dropdown-toggle', { detail: true }));
      }}
      onMouseLeave={() => {
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('navbar-dropdown-toggle', { detail: false }));
      }}
    >
      <button
        className="nav-link text-[#f8fcdc]/70 hover:text-[#dc9e63] transition-colors duration-300 text-[10px] font-medium uppercase cursor-pointer"
        style={{ letterSpacing: '0.25em', transform: 'translateY(-2px)' }}
        aria-expanded={isOpen}
        aria-controls="desktop-music-submenu"
      >
        MUSIC
      </button>

      {/* Dropdown Menu */}
      <div
        id="desktop-music-submenu"
        className={`absolute top-full left-0 mt-2 bg-[#3a1515]/60 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden transition-all duration-300 z-50 ${
          isOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform translate-y-2'
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
  );
}