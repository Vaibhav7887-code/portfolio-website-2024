﻿/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [],
      unoptimized: false,
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    }
  }
  
  module.exports = nextConfig