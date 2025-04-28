'use client';

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  category: 'Merch' | 'Music' | 'Bundles' | 'Backing Track';
  price: string | { original: string; sale: string };
  tags: string[];
  image: string;
  url: string;
  description?: string;
};

export const allItems: Product[] = [
  // Merch
  { id: 'cat-scores-black', title: 'CAT SCORES T-SHIRT', category: 'Merch', subtitle: 'BLACK', price: '$29.95', tags: ['t-shirt', 'black', 'shirt'], image: '/black-cats-scores-tee.png', url: '/shop' },
  { id: 'cat-scores-white', title: 'CAT SCORES T-SHIRT', category: 'Merch', subtitle: 'WHITE', price: '$29.95', tags: ['t-shirt', 'white', 'shirt'], image: '/white-cats-scores-tee.png', url: '/shop' },
  { id: 'cat-to-the-moon', title: 'A CAT TO THE MOON', category: 'Merch', subtitle: 'STICKERS', price: '$4.95', tags: ['sticker', 'cat'], image: '/a-cat-to-the-moon-stickers.png', url: '/shop' },
  { id: 'musician-cats', title: 'A MUSICIAN CATS', category: 'Merch', subtitle: 'STICKERS', price: '$4.95', tags: ['sticker', 'cat'], image: '/a-musician-cats.png', url: '/shop' },
  { id: 'signed-keychain', title: 'UNDA ALUNDA', category: 'Merch', subtitle: 'SIGNED KEYCHAIN', price: '$9.95', tags: ['keychain', 'signed'], image: '/unda-alunda-sign-keychain.png', url: '/shop' },

  // Music
  { id: 'audio-digipak', title: 'DARK WONDERFUL WORLD', subtitle: 'DIGIPAK CD', category: 'Music', price: '$24.95', tags: ['audio', 'cd', 'album'], image: '/audio-digipak-dww.png', url: '/shop' },
  { id: 'live-cd', title: 'DARK WONDERFUL WORLD', subtitle: 'LIVE CD', category: 'Music', price: '$14.95', tags: ['live', 'cd', 'album'], image: '/live-cd-dww.png', url: '/shop' },
  { id: 'guitars-book', title: 'FULL GUITARS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: '$49.95', tags: ['book', 'transcription', 'guitar'], image: '/full-guitars-transcription.png', url: '/shop' },
  { id: 'bass-book', title: 'FULL BASS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: '$49.95', tags: ['book', 'transcription', 'bass'], image: '/full-bass-transcription.png', url: '/shop' },
  { id: 'keys-book', title: 'FULL KEYS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: '$49.95', tags: ['book', 'transcription', 'keys'], image: '/full-keys-transcription.png', url: '/shop' },
  { id: 'drums-book', title: 'FULL DRUMS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', price: '$49.95', tags: ['book', 'transcription', 'drums'], image: '/full-drums-transcription.png', url: '/shop' },

  // Bundles
  { id: 'album-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'ALBUM MERCH BUNDLE', category: 'Bundles', price: { original: '$64.85', sale: '$51.88' }, tags: ['bundle', 'album', 'merch'], image: '/dark-wonderful-world-album-merch-bundle.png', url: '/shop' },
{ id: 'book-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & MERCH BUNDLE', category: 'Bundles', price: { original: '$84.85', sale: '$67.88' }, tags: ['bundle', 'book', 'merch'], image: '/dark-wonderful-world-book-&-merch-bundle.png', url: '/shop' },
{ id: 'book-bonus-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & BONUS MERCH BUNDLE', category: 'Bundles', price: { original: '$94.75', sale: '$75.80' }, tags: ['bundle', 'book', 'bonus'], image: '/dark-wonderful-world-book-&-bonus-merch-bundle.png', url: '/shop' },
{ id: 'dual-album-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'DUAL ALBUM MERCH BUNDLE', category: 'Bundles', price: { original: '$109.75', sale: '$87.80' }, tags: ['bundle', 'album', 'dual'], image: '/dark-wonderful-world-dual-album-merch-bundle.png', url: '/shop' },
{ id: 'book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK BUNDLE', category: 'Bundles', price: { original: '$74.90', sale: '$59.92' }, tags: ['bundle', 'book'], image: '/dark-wonderful-world-book-bundle.png', url: '/shop' },
{ id: 'apparel-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'APPAREL & BOOK BUNDLE', category: 'Bundles', price: { original: '$104.85', sale: '$83.88' }, tags: ['bundle', 'apparel', 'book'], image: '/dark-wonderful-world-apparel-&-book-bundle.png', url: '/shop' },
{ id: 'sticker-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'STICKER & BOOK BUNDLE', category: 'Bundles', price: { original: '$84.80', sale: '$67.84' }, tags: ['bundle', 'sticker', 'book'], image: '/dark-wonderful-world-sticker-&-book-bundle.png', url: '/shop' },

  // Backing Tracks
  { id: 'anomic-drums', title: 'ANOMIC', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track', price: '$7.95', tags: ['drums', 'track'], image: '/anomic-no-drums.jpg', url: '/shop' },
  { id: 'jyy-guitars', title: 'JYY', subtitle: 'LEAD GUITAR BACKING TRACK', category: 'Backing Track', price: '$7.95', tags: ['guitars', 'track'], image: '/jyy-no-guitars.jpg', url: '/shop' },
  { id: 'atlantic-guitar', title: 'ATLANTIC', subtitle: 'GUITARS BACKING TRACK', category: 'Backing Track', price: '$8.95', tags: ['lead guitar', 'track'], image: '/atlantic-no-lead-guitar.jpg', url: '/shop' },
  { id: 'out-dark-drums', title: 'OUT OF THE DARK', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track', price: '$11.95', tags: ['drums', 'track'], image: '/out-of-the-dark-no-drums.jpg', url: '/shop' },
  { id: 'feign-guitars', title: 'FEIGN', subtitle: 'GUITARS BACKING TRACK', category: 'Backing Track', price: '$11.95', tags: ['guitars', 'track'], image: '/feign-no-guitars.jpg', url: '/shop' },
  { id: 'dark-keys', title: 'THE DARK', subtitle: 'KEYS BACKING TRACK', category: 'Backing Track', price: '$4.95', tags: ['keys', 'track'], image: '/the-dark-no-keys.jpg', url: '/shop' },
  { id: 'reddown-bass', title: 'RED DOWN', subtitle: 'BASS BACKING TRACK', category: 'Backing Track', price: '$7.95', tags: ['bass', 'track'], image: '/reddown-no-bass.jpg', url: '/shop' },
  { id: 'quietness-bass', title: 'QUIETNESS', subtitle: 'BASS BACKING TRACK', category: 'Backing Track', price: '$7.95', tags: ['bass', 'track'], image: '/quietness-no-bass.jpg', url: '/shop' }
];