/* allItems.ts - Performance Optimized */

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
  weight?: number; // in kilograms
  bundleItems?: string[]; // list of product IDs
};

// 🚀 PERFORMANCE: Group products by category for faster filtering
export const productsByCategory = {
  merch: [
    { id: 'cat-scores-t-shirt-black', title: 'CAT SCORES T-SHIRT', category: 'Merch' as const, type: 'physical' as const, subtitle: 'BLACK', price: 29.95, tags: ['t-shirt', 'black', 'shirt'], image: '/black-cats-scores-tee.webp', url: '/product/cat-scores-t-shirt-black', weight: 0.2 },
    { id: 'cat-scores-t-shirt-white', title: 'CAT SCORES T-SHIRT', category: 'Merch' as const, type: 'physical' as const, subtitle: 'WHITE', price: 29.95, tags: ['t-shirt', 'white', 'shirt'], image: '/white-cats-scores-tee.webp', url: '/product/cat-scores-t-shirt-white', weight: 0.2 },
    { id: 'cat-to-the-moon', title: 'A CAT TO THE MOON', category: 'Merch' as const, type: 'physical' as const, subtitle: 'STICKERS', price: 4.95, tags: ['sticker', 'cat'], image: '/a-cat-to-the-moon-stickers.webp', url: '/product/cat-to-the-moon', weight: 0.01, description: 'PVC Stickers (7x7cm. / piece)\nPlease Note: The product image displayed is a mock-up; actual item may vary.' },
    { id: 'musician-cats', title: 'A MUSICIAN CATS', category: 'Merch' as const, type: 'physical' as const, subtitle: 'STICKERS', price: 4.95, tags: ['sticker', 'cat'], image: '/a-musician-cats.webp', url: '/product/musician-cats', weight: 0.01, description: 'PVC Stickers (7x7cm. / piece)\nPlease Note: The product image displayed is a mock-up; actual item may vary.' },
    { id: 'signed-keychain', title: 'UNDA ALUNDA', category: 'Merch' as const, type: 'physical' as const, subtitle: 'SIGNED KEYCHAIN', price: 9.95, tags: ['keychain', 'signed'], image: '/unda-alunda-sign-keychain.webp', url: '/product/signed-keychain', weight: 0.03 }
  ],
  
  music: [
    {
      id: 'audio-digipak',
      title: 'DARK WONDERFUL WORLD',
      subtitle: 'DIGIPAK CD',
      category: 'Music' as const,
      type: 'physical' as const,
      price: 24.95,
      tags: ['audio', 'cd', 'album'],
      image: '/audio-digipak-dww.webp',
      url: '/product/audio-digipak',
      weight: 0.12,
      description: 'Amidst the whispers of darkness and the cries of hope, Dark Wonderful World is a love letter to every broken piece inside you. The music wraps around your hidden wounds and unleashes the demons you never dared to name.\n\nHere, sorrow isn\'t an end—it\'s a brutal beginning, in a world that\'s devastatingly beautiful.\n\nTracklist:\n1) The Dark\n2) Anomic\n3) Consonance\n4) JYY\n5) Out of the Dark\n6) Can\'t Feel My Face\n7) Red Down\n8) Atlantic\n9) Feign\n10) Dark Wonderful World\n11) Quietness\n\nPlease Note: The product image displayed is a mock-up; actual item may vary.'
    },
    {
      id: 'live-cd',
      title: 'DARK WONDERFUL WORLD',
      subtitle: 'LIVE CD',
      category: 'Music' as const,
      type: 'physical' as const,
      price: 14.95,
      tags: ['live', 'cd', 'album'],
      image: '/live-cd-dww.webp',
      url: '/product/live-cd',
      weight: 0.12,
      description: 'The first live performance under the name Unda Alunda, recorded at the official album launch concert in Thailand on April 18, 2024.\n\nFeatures 8 tracks from the Dark Wonderful World album, performed by the full live band.\n\nTracklist:\n1) The Dark\n2) Anomic\n3) Consonance\n4) Out of the Dark\n5) Can\'t Feel My Face\n6) Feign\n7) Dark Wonderful World\n8) Quietness\n\nUnda Alunda – Guitars\nWarit Techakanont – Keyboard & Synth\nThirakoon Matsri – Bass\nTJ Trinidad – Drums\n\nAudio Engineered, Mixed & Mastered by Atiruj Worakittichat\nFilmed by Titikorn Poomanee, Sattawat Polpanna, Supanut Ditjaroen, Anon Preeyasaksakul\nCamera Assisted by Thanathorn Ngamchaleaw\nEdited by lukpee\nArtwork by Zandy Niwattra\nPlease Note: The product image displayed is a mock-up; actual item may vary.'
    },
    { id: 'guitars-book', title: 'FULL GUITARS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music' as const, type: 'physical' as const, price: 49.95, tags: ['book', 'transcription', 'guitar'], image: '/full-guitars-transcription.webp', url: '/product/guitars-book', weight: 0.3 },
    { id: 'bass-book', title: 'FULL BASS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music' as const, type: 'physical' as const, price: 49.95, tags: ['book', 'transcription', 'bass'], image: '/full-bass-transcription.webp', url: '/product/bass-book', weight: 0.3 },
    { id: 'keys-book', title: 'FULL KEYS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music' as const, type: 'physical' as const, price: 49.95, tags: ['book', 'transcription', 'keys'], image: '/full-keys-transcription.webp', url: '/product/keys-book', weight: 0.3 },
    { id: 'drums-book', title: 'FULL DRUMS TRANSCRIPTION', subtitle: 'PRINTED BOOK', category: 'Music' as const, type: 'physical' as const, price: 49.95, tags: ['book', 'transcription', 'drums'], image: '/full-drums-transcription.webp', url: '/product/drums-book', weight: 0.3 }
  ],
  
  bundles: [
    { id: 'album-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'ALBUM MERCH BUNDLE', category: 'Bundles' as const, type: 'physical' as const, price: { original: 64.85, sale: 51.88 }, tags: ['bundle', 'album', 'merch'], image: '/dark-wonderful-world-album-merch-bundle.webp', url: '/product/album-merch-bundle', bundleItems: ['signed-keychain', 'audio-digipak', 'cat-scores-t-shirt-black'] },
    { id: 'book-merch-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & MERCH BUNDLE', category: 'Bundles' as const, type: 'physical' as const, price: { original: 84.85, sale: 67.88 }, tags: ['bundle', 'book', 'merch'], image: '/dark-wonderful-world-book-&-merch-bundle.webp', url: '/product/book-merch-bundle', bundleItems: ['signed-keychain', 'audio-digipak', 'guitars-book'] },
    { id: 'book-bonus-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & BONUS MERCH BUNDLE', category: 'Bundles' as const, type: 'physical' as const, price: { original: 94.75, sale: 75.80 }, tags: ['bundle', 'book', 'bonus'], image: '/dark-wonderful-world-book-&-bonus-merch-bundle.webp', url: '/product/book-bonus-bundle', bundleItems: ['guitars-book', 'signed-keychain', 'audio-digipak', 'musician-cats', 'cat-to-the-moon'] },
    { id: 'dual-album-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'DUAL ALBUM MERCH BUNDLE', category: 'Bundles' as const, type: 'physical' as const, price: { original: 109.75, sale: 87.80 }, tags: ['bundle', 'album', 'dual'], image: '/dark-wonderful-world-dual-album-merch-bundle.webp', url: '/product/dual-album-bundle', bundleItems: ['audio-digipak', 'live-cd', 'cat-scores-t-shirt-black', 'signed-keychain', 'cat-scores-t-shirt-white'] },
    { id: 'book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK BUNDLE', category: 'Bundles' as const, type: 'physical' as const, price: { original: 74.90, sale: 59.92 }, tags: ['bundle', 'book'], image: '/dark-wonderful-world-book-bundle.webp', url: '/product/book-bundle', bundleItems: ['guitars-book', 'audio-digipak'] },
    { id: 'apparel-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'APPAREL & BOOK BUNDLE', category: 'Bundles' as const, type: 'physical' as const, price: { original: 104.85, sale: 83.88 }, tags: ['bundle', 'apparel', 'book'], image: '/dark-wonderful-world-apparel-&-book-bundle.webp', url: '/product/apparel-book-bundle', bundleItems: ['cat-scores-t-shirt-black', 'audio-digipak', 'guitars-book'] },
    { id: 'sticker-book-bundle', title: 'DARK WONDERFUL WORLD', subtitle: 'STICKER & BOOK BUNDLE', category: 'Bundles' as const, type: 'physical' as const, price: { original: 84.80, sale: 67.84 }, tags: ['bundle', 'sticker', 'book'], image: '/dark-wonderful-world-sticker-&-book-bundle.webp', url: '/product/sticker-book-bundle', bundleItems: ['cat-to-the-moon', 'musician-cats', 'audio-digipak', 'guitars-book'] }
  ],
  
  backingTracks: [
    { id: 'anomic-drums', title: 'ANOMIC', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track' as const, type: 'digital' as const, price: 7.95, tags: ['drums', 'track'], image: '/anomic-no-drums.webp', url: '/product/anomic-drums', description: '**ANOMIC – Drums Backing Track**\nHigh-resolution backing track without **drums**, perfect for practice, covers, or performances.\n\n• **Format:** WAV, 48 kHz / 24-bit\n• **Full-length**, professionally mixed\n• Compatible with all major DAWs\n\n**Mixed & Mastered by Atipoung Wanlua**\n\nFor personal use only.\nSee our Terms & Conditions for license details.\n\n**Copyright © 2025 Unda Alunda**' },
    { id: 'jyy-guitars', title: 'JYY', subtitle: 'LEAD GUITAR BACKING TRACK', category: 'Backing Track' as const, type: 'digital' as const, price: 7.95, tags: ['guitars', 'track'], image: '/jyy-no-guitars.webp', url: '/product/jyy-guitars', description: '**JYY – Lead Guitar Backing Track**\nHigh-resolution backing track without **lead guitar**, perfect for practice, covers, or performances.\n\n• **Format:** WAV, 48 kHz / 24-bit\n• **Full-length**, professionally mixed\n• Compatible with all major DAWs\n\n**Mixed & Mastered by Atipoung Wanlua**\n\nFor personal use only.\nSee our Terms & Conditions for license details.\n\n**Copyright © 2025 Unda Alunda**' },
    { id: 'atlantic-guitar', title: 'ATLANTIC', subtitle: 'GUITARS BACKING TRACK', category: 'Backing Track' as const, type: 'digital' as const, price: 8.95, tags: ['lead guitar', 'track'], image: '/atlantic-no-lead-guitar.webp', url: '/product/atlantic-guitar', description: '**ATLANTIC – Guitars Backing Track**\nHigh-resolution backing track without **guitars**, perfect for practice, covers, or performances.\n\n• **Format:** WAV, 48 kHz / 24-bit\n• **Full-length**, professionally mixed\n• Compatible with all major DAWs\n\n**Mixed & Mastered by Atipoung Wanlua**\n\nFor personal use only.\nSee our Terms & Conditions for license details.\n\n**Copyright © 2025 Unda Alunda**' },
    { id: 'out-dark-drums', title: 'OUT OF THE DARK', subtitle: 'DRUMS BACKING TRACK', category: 'Backing Track' as const, type: 'digital' as const, price: 11.95, tags: ['drums', 'track'], image: '/out-of-the-dark-no-drums.webp', url: '/product/out-dark-drums', description: '**OUT OF THE DARK – Drums Backing Track**\nHigh-resolution backing track without **drums**, perfect for practice, covers, or performances.\n\n• **Format:** WAV, 48 kHz / 24-bit\n• **Full-length**, professionally mixed\n• Compatible with all major DAWs\n\n**Mixed & Mastered by Atipoung Wanlua**\n\nFor personal use only.\nSee our Terms & Conditions for license details.\n\n**Copyright © 2025 Unda Alunda**' },
    { id: 'feign-guitars', title: 'FEIGN', subtitle: 'GUITARS BACKING TRACK', category: 'Backing Track' as const, type: 'digital' as const, price: 11.95, tags: ['guitars', 'track'], image: '/feign-no-guitars.webp', url: '/product/feign-guitars', description: '**FEIGN – Guitars Backing Track**\nHigh-resolution backing track without **guitars**, perfect for practice, covers, or performances.\n\n• **Format:** WAV, 48 kHz / 24-bit\n• **Full-length**, professionally mixed\n• Compatible with all major DAWs\n\n**Mixed & Mastered by Atipoung Wanlua**\n\nFor personal use only.\nSee our Terms & Conditions for license details.\n\n**Copyright © 2025 Unda Alunda**' },
    { id: 'dark-keys', title: 'THE DARK', subtitle: 'KEYS BACKING TRACK', category: 'Backing Track' as const, type: 'digital' as const, price: 4.95, tags: ['keys', 'track'], image: '/the-dark-no-keys.webp', url: '/product/dark-keys', description: '**THE DARK – Keys Backing Track**\nHigh-resolution backing track without **keys**, perfect for practice, covers, or performances.\n\n• **Format:** WAV, 48 kHz / 24-bit\n• **Full-length**, professionally mixed\n• Compatible with all major DAWs\n\n**Mixed & Mastered by Atipoung Wanlua**\n\nFor personal use only.\nSee our Terms & Conditions for license details.\n\n**Copyright © 2025 Unda Alunda**' },
    { id: 'reddown-bass', title: 'RED DOWN', subtitle: 'BASS BACKING TRACK', category: 'Backing Track' as const, type: 'digital' as const, price: 7.95, tags: ['bass', 'track'], image: '/reddown-no-bass.webp', url: '/product/reddown-bass', description: '**RED DOWN – Bass Backing Track**\nHigh-resolution backing track without **bass**, perfect for practice, covers, or performances.\n\n• **Format:** WAV, 48 kHz / 24-bit\n• **Full-length**, professionally mixed\n• Compatible with all major DAWs\n\n**Mixed & Mastered by Atipoung Wanlua**\n\nFor personal use only.\nSee our Terms & Conditions for license details.\n\n**Copyright © 2025 Unda Alunda**' },
    { id: 'quietness-bass', title: 'QUIETNESS', subtitle: 'BASS BACKING TRACK', category: 'Backing Track' as const, type: 'digital' as const, price: 7.95, tags: ['bass', 'track'], image: '/quietness-no-bass.webp', url: '/product/quietness-bass', description: '**QUIETNESS – Bass Backing Track**\nHigh-resolution backing track without **bass**, perfect for practice, covers, or performances.\n\n• **Format:** WAV, 48 kHz / 24-bit\n• **Full-length**, professionally mixed\n• Compatible with all major DAWs\n\n**Mixed & Mastered by Atipoung Wanlua**\n\nFor personal use only.\nSee our Terms & Conditions for license details.\n\n**Copyright © 2025 Unda Alunda**' }
  ]
};

// 🚀 PERFORMANCE: Flatten array with optimized structure
export const allItems: Product[] = [
  ...productsByCategory.merch,
  ...productsByCategory.music,
  ...productsByCategory.bundles,
  ...productsByCategory.backingTracks
];

// 🚀 PERFORMANCE: Create lookup maps for O(1) access
export const productById = new Map(allItems.map(item => [item.id, item]));
export const productsByType = {
  digital: allItems.filter(item => item.type === 'digital'),
  physical: allItems.filter(item => item.type === 'physical')
};

// 🚀 PERFORMANCE: Tag index for faster search
export const tagIndex = new Map<string, Product[]>();
allItems.forEach(product => {
  product.tags.forEach(tag => {
    if (!tagIndex.has(tag)) {
      tagIndex.set(tag, []);
    }
    tagIndex.get(tag)!.push(product);
  });
});

// 🚀 PERFORMANCE: Helper functions for optimized filtering
export const getProductsByCategory = (category: Product['category']) => {
  switch (category) {
    case 'Merch': return productsByCategory.merch;
    case 'Music': return productsByCategory.music;
    case 'Bundles': return productsByCategory.bundles;
    case 'Backing Track': return productsByCategory.backingTracks;
    default: return [];
  }
};

export const getProductByTag = (tag: string) => tagIndex.get(tag) || [];

export const searchProducts = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return allItems.filter(product => 
    product.title.toLowerCase().includes(lowercaseQuery) ||
    product.subtitle.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};