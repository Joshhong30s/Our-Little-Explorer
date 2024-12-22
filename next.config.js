/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['imgur.com', 'i.imgur.com', 'vercel.com', 'youtube.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgur.com/',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com/',
      },
      {
        protocol: 'https',
        hostname: 'vercel.com',
      },
      {
        protocol: 'https',
        hostname: 'youtube.com',
      },
    ],
  },
  i18n,
};

module.exports = nextConfig;
