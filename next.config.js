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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  i18n,
  serverRuntimeConfig: {
    maxFileSize: 32 * 1024 * 1024,
  },
};

module.exports = nextConfig;
