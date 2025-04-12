import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🛡️ อนุญาตให้เข้าถึงจากมือถือในวง Wi-Fi เดียวกัน
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.0.197:3000",
    "http://localhost:3001",
    "http://192.168.0.197:3001"
  ],
};

export default nextConfig;