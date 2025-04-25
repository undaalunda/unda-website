'use client';

import { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

// Product list for search functionality
export const allItems = [
  // Merch
  { id: 'cat-scores-black', title: 'CAT SCORES T-SHIRT', category: 'Merch', subtitle: 'BLACK', price: '$29.95', tags: ['t-shirt', 'black', 'shirt'], image: '/black-cats-scores-tee.png', url: '/shop' },
  { id: 'cat-scores-white', title: 'CAT SCORES T-SHIRT', category: 'Merch', subtitle: 'WHITE', price: '$29.95', tags: ['t-shirt', 'white', 'shirt'], image: '/white-cats-scores-tee.png', url: '/shop' },
  { id: 'cat-to-the-moon', title: 'A CAT TO THE MOON', category: 'Merch', subtitle: 'STICKERS', price: '$5.00', tags: ['sticker', 'cat'], image: '/a-cat-to-the-moon-stickers.png', url: '/shop' },
  { id: 'musician-cats', title: 'A MUSICIAN CATS', category: 'Merch', subtitle: 'STICKERS', price: '$5.00', tags: ['sticker', 'cat'], image: '/a-musician-cats.png', url: '/shop' },
  { id: 'signed-keychain', title: 'UNDA ALUNDA', category: 'Merch', subtitle: 'SIGNED KEYCHAIN', price: '$9.95', tags: ['keychain', 'signed'], image: '/unda-alunda-sign-keychain.png', url: '/shop' },

  // Music
  { id: 'audio-digipak', title: 'DARK WONDERFUL WORLD', subtitle: 'DIGIPAK CD', category: 'Music', price: '$25.00', tags: ['audio', 'cd', 'album'], image: '/audio-digipak-dww.png', url: '/shop' },
  { id: 'live-cd', title: 'DARK WONDERFUL WORLD', subtitle: 'LIVE CD', category: 'Music', price: '$15.00', tags: ['live', 'cd', 'album'], image: '/live-cd-dww.png', url: '/shop' },
  { id: 'guitars-book', title: 'FULL GUITARS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: '$49.95', tags: ['book', 'transcription', 'guitar'], image: '/full-guitars-transcription.png', url: '/shop' },
  { id: 'bass-book', title: 'FULL BASS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: '$49.95', tags: ['book', 'transcription', 'bass'], image: '/full-bass-transcription.png', url: '/shop' },
  { id: 'keys-book', title: 'FULL KEYS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: '$49.95', tags: ['book', 'transcription', 'keys'], image: '/full-keys-transcription.png', url: '/shop' },
  { id: 'drums-book', title: 'FULL DRUMS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: '$49.95', tags: ['book', 'transcription', 'drums'], image: '/full-drums-transcription.png', url: '/shop' },

  // Bundles
  { id: 'album-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'ALBUM MERCH BUNDLE', category: 'Bundles', price: { original: '$64.90', sale: '$51.92' }, tags: ['bundle', 'album', 'merch'], image: '/dark-wonderful-world-album-merch-bundle.png', url: '/shop' },
  { id: 'book-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & MERCH BUNDLE', category: 'Bundles', price: { original: '$84.90', sale: '$67.92' }, tags: ['bundle', 'book', 'merch'], image: '/dark-wonderful-world-book-&-merch-bundle.png', url: '/shop' },
  { id: 'book-bonus-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & BONUS MERCH BUNDLE', category: 'Bundles', price: { original: '$94.90', sale: '$75.92' }, tags: ['bundle', 'book', 'bonus'], image: '/dark-wonderful-world-book-&-bonus-merch-bundle.png', url: '/shop' },
  { id: 'dual-album-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'DUAL ALBUM MERCH BUNDLE', category: 'Bundles', price: { original: '$109.85', sale: '$87.88' }, tags: ['bundle', 'album', 'dual'], image: '/dark-wonderful-world-dual-album-merch-bundle.png', url: '/shop' },
  { id: 'book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK BUNDLE', category: 'Bundles', price: '$45.00', tags: ['bundle', 'book'], image: '/dark-wonderful-world-book-bundle.png', url: '/shop' },
  { id: 'apparel-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'APPAREL & BOOK BUNDLE', category: 'Bundles', price: '$59.95', tags: ['bundle', 'apparel', 'book'], image: '/dark-wonderful-world-apparel-&-book-bundle.png', url: '/shop' },
  { id: 'sticker-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'STICKER & BOOK BUNDLE', category: 'Bundles', price: '$39.95', tags: ['bundle', 'sticker', 'book'], image: '/dark-wonderful-world-sticker-&-book-bundle.png', url: '/shop' },

  // Backing Tracks
  { id: 'anomic-drums', title: 'ANOMIC', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track', price: '$8.00', tags: ['drums', 'track'], image: '/anomic-no-drums.jpg', url: '/shop' },
  { id: 'jyy-guitars', title: 'JYY', subtitle: 'LEAD GUITAR BACKING TRACK',  category: 'Backing Track', price: '$8.00', tags: ['guitars', 'track'], image: '/jyy-no-guitars.jpg', url: '/shop' },
  { id: 'atlantic-guitar', title: 'ATLANTIC', subtitle: 'GUITARS BACKING TRACK',  category: 'Backing Track', price: '$9.00', tags: ['lead guitar', 'track'], image: '/atlantic-no-lead-guitar.jpg', url: '/shop' },
  { id: 'out-dark-drums', title: 'OUT OF THE DARK', subtitle: 'DRUMS BACKING TRACK',  category: 'Backing Track', price: '$12.00', tags: ['drums', 'track'], image: '/out-of-the-dark-no-drums.jpg', url: '/shop' },
  { id: 'feign-guitars', title: 'FEIGN', subtitle: 'GUITARS BACKING TRACK',  category: 'Backing Track', price: '$12.00', tags: ['guitars', 'track'], image: '/feign-no-guitars.jpg', url: '/shop' },
  { id: 'dark-keys', title: 'THE DARK', subtitle: 'KEYS BACKING TRACK',  category: 'Backing Track', price: '$5.00', tags: ['keys', 'track'], image: '/the-dark-no-keys.jpg', url: '/shop' },
  { id: 'reddown-bass', title: 'RED DOWN', subtitle: 'BASS BACKING TRACK',  category: 'Backing Track', price: '$8.00', tags: ['bass', 'track'], image: '/reddown-no-bass.jpg', url: '/shop' },
  { id: 'quietness-bass', title: 'QUIETNESS', subtitle: 'BASS BACKING TRACK',  category: 'Backing Track', price: '$8.00', tags: ['bass', 'track'], image: '/quietness-no-bass.jpg', url: '/shop' }
];
export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No navigation needed
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0dea] flex items-start justify-center pt-32 px-4">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 text-lg text-[#f8fcdc] caret-[#dc9e63] bg-transparent border border-[#dc9e63] rounded-md placeholder:text-[#777] outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#f8fcdc] hover:text-[#dc9e63] transition cursor-pointer"
          >
            <X size={24} strokeWidth={1.4} />
          </button>
        </form>

        {searchQuery.trim() && (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-sm opacity-60 text-center">No Results... Try something else.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <Link
                    href={item.url}
                    key={item.id}
                    onClick={onClose}
                    className="group border border-[#dc9e63] rounded-md overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                    <p className="mt-2 text-sm text-center group-hover:text-[#dc9e63]">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
