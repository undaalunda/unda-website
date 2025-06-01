// app/sitemap.ts - Perfect sync with allItems! 🎸

import { MetadataRoute } from 'next'
import { allItems } from '@/components/allItems'

const BASE_URL = 'https://unda-website.vercel.app' // TODO: Change to undaalunda.com when ready

export default function sitemap(): MetadataRoute.Sitemap {
  // 🎸 Get all 28 products from allItems (auto-sync!)
  const productUrls = allItems.map((item) => ({
    url: `${BASE_URL}/product/${item.id}`,
    lastModified: new Date('2025-06-02'),
    changeFrequency: 'weekly' as const,
    // 🎯 Smart priority based on category & type
    priority: (() => {
      // Physical music products = highest priority
      if (item.category === 'Music' && item.type === 'physical') return 0.9
      
      // Bundles = high value items
      if (item.category === 'Bundles') return 0.8
      
      // Digital music products
      if (item.category === 'Music' && item.type === 'digital') return 0.8
      
      // Backing tracks = practice tools
      if (item.category === 'Backing Track') return 0.7
      
      // Merchandise
      if (item.category === 'Merch') return 0.6
      
      return 0.6
    })(),
  }))

  return [
    // 🚀 MAIN PAGES - High Priority (exactly like your XML)
    {
      url: BASE_URL,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // 🚀 SHOP PAGES (from your XML)
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/shop/merch`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shop/music`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shop/bundles`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shop/digital`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // 🚀 TOUR & CONTACT
    {
      url: `${BASE_URL}/tour`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // 🚀 ALL PRODUCT PAGES (auto-generated from allItems!)
    ...productUrls,

    // 🚀 LEGAL PAGES
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/shipping-and-returns`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // 🚀 UTILITY PAGES
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'never',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/checkout`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'never',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/thank-you`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'never',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/order-status`,
      lastModified: new Date('2025-06-02'),
      changeFrequency: 'never',
      priority: 0.3,
    },
  ]
}

// 🎯 Debug helper & stats (optional - ลบได้)
export const sitemapStats = {
  totalProducts: allItems.length, // 28 products
  categories: {
    music: allItems.filter(item => item.category === 'Music').length,           // 6
    merch: allItems.filter(item => item.category === 'Merch').length,           // 5  
    bundles: allItems.filter(item => item.category === 'Bundles').length,       // 7
    backingTracks: allItems.filter(item => item.category === 'Backing Track').length, // 8
  },
  types: {
    physical: allItems.filter(item => item.type === 'physical').length,         // 20
    digital: allItems.filter(item => item.type === 'digital').length,           // 8
  },
  generated: new Date().toISOString(),
  
  // 🎵 Featured products (for homepage linking)
  featuredProducts: [
    'audio-digipak',     // Main album
    'live-cd',           // Live performance  
    'guitars-book',      // Guitar transcription
    'dual-album-bundle', // Best value bundle
    'anomic-drums',      // Popular backing track
  ]
}