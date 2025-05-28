// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.0.197:3000",
    "http://localhost:3001",
    "http://192.168.0.197:3001",
  ],
  experimental: {
    scrollRestoration: true,
  },
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
  // 👇 สำคัญชิบหาย ใส่ไว้ ไม่งั้น /pages/api/... จะหายไปตอน production
  output: "standalone",
};

export default nextConfig;