// next.config.ts - Performance Optimized + Fixed Scroll

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

  // 🚀 เพิ่ม Performance optimizations
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [480, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  compress: true,

  // 🔧 FIXED: เอา scrollRestoration ออกหมด!
  experimental: {
    webpackBuildWorker: true,
  },

  // 🚀 Headers สำหรับ caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 🚀 Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Tree shaking optimization
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    return config;
  },
};

export default nextConfig;