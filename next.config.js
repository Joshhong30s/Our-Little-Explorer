/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const nextI18NextConfig = require("./next-i18next.config");

module.exports = {
  images: {
    domains: [
      "onrender.com",
      "render.com",
      "zero6babyserver.onrender.com",
      "imgur.com",
      "i.imgur.com",
      "vercel.com",
      "youtube.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgur.com/",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com/",
      },
      {
        protocol: "https",
        hostname: "onrender.com",
      },
      {
        protocol: "https",
        hostname: "vercel.com",
      },
      {
        protocol: "https",
        hostname: "youtube.com",
      },
    ],
  },
  nextI18NextConfig,
};
