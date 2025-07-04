// next.config.ts - Performance Monster 🚀

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ คงไว้ settings เดิมของคุณ
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.0.197:3000",
    "http://localhost:3001",
    "http://192.168.0.197:3001",
  ],

  env: {
    DHL_USERNAME: process.env.DHL_USERNAME,
    DHL_PASSWORD: process.env.DHL_PASSWORD,
    DHL_ACCOUNT_NUMBER: process.env.DHL_ACCOUNT_NUMBER,
    DHL_API_URL: process.env.DHL_API_URL,
    DHL_TRACKING_AUTH: process.env.DHL_TRACKING_AUTH,
    
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_SECRET_KEY_TEST: process.env.STRIPE_SECRET_KEY_TEST,
    STRIPE_SECRET_KEY_LIVE: process.env.STRIPE_SECRET_KEY_LIVE,
    STRIPE_WEBHOOK_SECRET_TEST: process.env.STRIPE_WEBHOOK_SECRET_TEST,
    STRIPE_WEBHOOK_SECRET_LIVE: process.env.STRIPE_WEBHOOK_SECRET_LIVE,
  },

  output: "standalone",

  // 🚀 SUPERCHARGED Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'], // 🎯 AVIF first (เล็กกว่า WebP 30%)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // 🎯 ปรับให้ตรงกับ mobile breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // 🎯 ลบ 384 ที่ไม่ค่อยใช้
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 🚀 ENHANCED Compression
  compress: true,
  poweredByHeader: false, // 🔒 Security + Performance
  
  // 🚀 ADVANCED Experimental Features
  experimental: {
    webpackBuildWorker: true,
    // 🚀 NEW: Bundle optimization
    optimizePackageImports: [
      'lucide-react',
      '@/components',
      '@/lib',
      'next/image',
      'react'
    ],
    // 🔧 แก้ปัญหา swc
    forceSwcTransforms: false,
  },

  // 🚀 SUPERCHARGED Headers with Security
  async headers() {
    return [
      // 🎯 Static Assets - Ultra Aggressive Caching
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|eot|ttf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=604800, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // 🎯 Next.js Static Files
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 🎯 Fonts Optimization
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      // 🚀 NEW: API Routes Caching
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600', // 5 min cache
          },
        ],
      },
      // 🚀 NEW: Security Headers
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // 🚀 Simplified Webpack Config
  webpack: (config, { isServer, dev }) => {
    // 🎯 Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // 🚀 NEW: TypeScript optimization
  typescript: {
    ignoreBuildErrors: false, // 🔒 Force type safety - ปลอดภัยสำหรับ E-commerce
  },

  // 🚀 NEW: ESLint optimization  
  eslint: {
    ignoreDuringBuilds: false, // 🔒 Force code quality - ป้องกัน bugs
  },
};

export default nextConfig;