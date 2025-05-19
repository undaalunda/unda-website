/* allItems.ts */

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  category: 'Merch' | 'Music' | 'Bundles' | 'Backing Track';
  type: 'digital' | 'physical';
  price: number | { original: number; sale: number };
  tags: string[];
  image: string;
  url: string;
  description?: string;
};

export const allItems: Product[] = [
  // Merch
  { id: 'cat-scores-t-shirt-black', title: 'CAT SCORES T-SHIRT', category: 'Merch', type: 'physical', subtitle: 'BLACK', price: 29.95, tags: ['t-shirt', 'black', 'shirt'], image: '/black-cats-scores-tee.png', url: '/product/cat-scores-t-shirt-black' },
  { id: 'cat-scores-t-shirt-white', title: 'CAT SCORES T-SHIRT', category: 'Merch', type: 'physical', subtitle: 'WHITE', price: 29.95, tags: ['t-shirt', 'white', 'shirt'], image: '/white-cats-scores-tee.png', url: '/product/cat-scores-t-shirt-white' },
  { id: 'cat-to-the-moon', title: 'A CAT TO THE MOON', category: 'Merch', type: 'physical', subtitle: 'STICKERS', price: 4.95, tags: ['sticker', 'cat'], image: '/a-cat-to-the-moon-stickers.png', url: '/product/cat-to-the-moon', description: `PVC Stickers (7x7cm. / piece)\nPlease Note: The product image displayed is a mock-up; actual item may vary.` },
  { id: 'musician-cats', title: 'A MUSICIAN CATS', category: 'Merch', type: 'physical', subtitle: 'STICKERS', price: 4.95, tags: ['sticker', 'cat'], image: '/a-musician-cats.png', url: '/product/musician-cats', description: `PVC Stickers (7x7cm. / piece)\nPlease Note: The product image displayed is a mock-up; actual item may vary.` },
  { id: 'signed-keychain', title: 'UNDA ALUNDA', category: 'Merch', type: 'physical', subtitle: 'SIGNED KEYCHAIN', price: 9.95, tags: ['keychain', 'signed'], image: '/unda-alunda-sign-keychain.png', url: '/product/signed-keychain' },

  // Music
  {
    id: 'audio-digipak',
    title: 'DARK WONDERFUL WORLD',
    subtitle: 'DIGIPAK CD',
    category: 'Music',
    type: 'physical',
    price: 24.95,
    tags: ['audio', 'cd', 'album'],
    image: '/audio-digipak-dww.png',
    url: '/product/audio-digipak',
    description: `
  Amidst the whispers of darkness and the cries of hope, 
  Dark Wonderful World is a love letter to every broken piece inside you. 
  The music wraps around your hidden wounds and unleashes the demons you never dared to name.
  
  Here, sorrow isn't an end—it's a brutal beginning, in a world that's devastatingly beautiful.
  
  Tracklist:
  1) The Dark
  2) Anomic
  3) Consonance
  4) JYY
  5) Out of the Dark
  6) Can’t Feel My Face
  7) Red Down
  8) Atlantic
  9) Feign
  10) Dark Wonderful World
  11) Quietness
  
  Please Note: The product image displayed is a mock-up; actual item may vary.
    `.trim()
  },
  {
    id: 'live-cd',
    title: 'DARK WONDERFUL WORLD',
    subtitle: 'LIVE CD',
    category: 'Music',
    type: 'physical',
    price: 14.95,
    tags: ['live', 'cd', 'album'],
    image: '/live-cd-dww.png',
    url: '/product/live-cd',
    description: `
  The first live performance under the name Unda Alunda,
  recorded at the official album launch concert in Thailand on April 18, 2024.

  Features 8 tracks from the Dark Wonderful World album, performed by the full live band.
  
  Tracklist:
  1) The Dark
  2) Anomic
  3) Consonance
  4) Out of the Dark
  5) Can’t Feel My Face
  6) eign
  7) Dark Wonderful World
  8) Quietness

  Unda Alunda – Guitars
  Warit Techakanont – Keyboard & Synth
  Thirakoon Matsri – Bass
  TJ Trinidad – Drums

  Audio Engineered, Mixed & Mastered by Atiruj Worakittichat
  Filmed by Titikorn Poomanee, Sattawat Polpanna, Supanut Ditjaroen, Anon Preeyasaksakul
  Camera Assisted by Thanathorn Ngamchaleaw
  Edited by lukpee
  Artwork by Zandy Niwattra
  Please Note: The product image displayed is a mock-up; actual item may vary.
    `.trim()
  },

  { id: 'guitars-book', title: 'FULL GUITARS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', type: 'physical', price: 49.95, tags: ['book', 'transcription', 'guitar'], image: '/full-guitars-transcription.png', url: '/product/guitars-book' },
  { id: 'bass-book', title: 'FULL BASS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', type: 'physical', price: 49.95, tags: ['book', 'transcription', 'bass'], image: '/full-bass-transcription.png', url: '/product/bass-book' },
  { id: 'keys-book', title: 'FULL KEYS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', type: 'physical', price: 49.95, tags: ['book', 'transcription', 'keys'], image: '/full-keys-transcription.png', url: '/product/keys-book' },
  { id: 'drums-book', title: 'FULL DRUMS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music', type: 'physical', price: 49.95, tags: ['book', 'transcription', 'drums'], image: '/full-drums-transcription.png', url: '/product/drums-book' },

  // Bundles
  { id: 'album-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'ALBUM MERCH BUNDLE', category: 'Bundles', type: 'physical', price: { original: 64.85, sale: 51.88 }, tags: ['bundle', 'album', 'merch'], image: '/dark-wonderful-world-album-merch-bundle.png', url: '/product/album-merch-bundle' },
  { id: 'book-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & MERCH BUNDLE', category: 'Bundles', type: 'physical', price: { original: 84.85, sale: 67.88 }, tags: ['bundle', 'book', 'merch'], image: '/dark-wonderful-world-book-&-merch-bundle.png', url: '/product/book-merch-bundle' },
  { id: 'book-bonus-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & BONUS MERCH BUNDLE', category: 'Bundles', type: 'physical', price: { original: 94.75, sale: 75.80 }, tags: ['bundle', 'book', 'bonus'], image: '/dark-wonderful-world-book-&-bonus-merch-bundle.png', url: '/product/book-bonus-bundle' },
  { id: 'dual-album-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'DUAL ALBUM MERCH BUNDLE', category: 'Bundles', type: 'physical', price: { original: 109.75, sale: 87.80 }, tags: ['bundle', 'album', 'dual'], image: '/dark-wonderful-world-dual-album-merch-bundle.png', url: '/product/dual-album-bundle' },
  { id: 'book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK BUNDLE', category: 'Bundles', type: 'physical', price: { original: 74.90, sale: 59.92 }, tags: ['bundle', 'book'], image: '/dark-wonderful-world-book-bundle.png', url: '/product/book-bundle' },
  { id: 'apparel-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'APPAREL & BOOK BUNDLE', category: 'Bundles', type: 'physical', price: { original: 104.85, sale: 83.88 }, tags: ['bundle', 'apparel', 'book'], image: '/dark-wonderful-world-apparel-&-book-bundle.png', url: '/product/apparel-book-bundle' },
  { id: 'sticker-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'STICKER & BOOK BUNDLE', category: 'Bundles', type: 'physical', price: { original: 84.80, sale: 67.84 }, tags: ['bundle', 'sticker', 'book'], image: '/dark-wonderful-world-sticker-&-book-bundle.png', url: '/product/sticker-book-bundle' },

  // Backing Tracks
  { id: 'anomic-drums', title: 'ANOMIC', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track', type: 'digital', price: 7.95, tags: ['drums', 'track'], image: '/anomic-no-drums.jpg', url: '/product/anomic-drums' },
  { id: 'jyy-guitars', title: 'JYY', subtitle: 'LEAD GUITAR BACKING TRACK', category: 'Backing Track', type: 'digital', price: 7.95, tags: ['guitars', 'track'], image: '/jyy-no-guitars.jpg', url: '/product/jyy-guitars' },
  { id: 'atlantic-guitar', title: 'ATLANTIC', subtitle: 'GUITARS BACKING TRACK', category: 'Backing Track', type: 'digital', price: 8.95, tags: ['lead guitar', 'track'], image: '/atlantic-no-lead-guitar.jpg', url: '/product/atlantic-guitar' },
  { id: 'out-dark-drums', title: 'OUT OF THE DARK', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track', type: 'digital', price: 11.95, tags: ['drums', 'track'], image: '/out-of-the-dark-no-drums.jpg', url: '/product/out-dark-drums' },
  { id: 'feign-guitars', title: 'FEIGN', subtitle: 'GUITARS BACKING TRACK', category: 'Backing Track', type: 'digital', price: 11.95, tags: ['guitars', 'track'], image: '/feign-no-guitars.jpg', url: '/product/feign-guitars' },
  { id: 'dark-keys', title: 'THE DARK', subtitle: 'KEYS BACKING TRACK', category: 'Backing Track', type: 'digital', price: 4.95, tags: ['keys', 'track'], image: '/the-dark-no-keys.jpg', url: '/product/dark-keys' },
  { id: 'reddown-bass', title: 'RED DOWN', subtitle: 'BASS BACKING TRACK', category: 'Backing Track', type: 'digital', price: 7.95, tags: ['bass', 'track'], image: '/reddown-no-bass.jpg', url: '/product/reddown-bass' },
  { id: 'quietness-bass', title: 'QUIETNESS', subtitle: 'BASS BACKING TRACK', category: 'Backing Track', type: 'digital', price: 7.95, tags: ['bass', 'track'], image: '/quietness-no-bass.jpg', url: '/product/quietness-bass' },
];