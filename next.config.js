/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  images: {
    domains: ['onrender.com', 'render.com', 'zero4recipe-s.onrender.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'www.simplyrecipes.com',
      },
      {
        protocol: 'https',
        hostname: 'onrender.com',
      },
    ],
  },
}
