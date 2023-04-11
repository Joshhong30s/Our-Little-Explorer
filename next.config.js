/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  images: {
    domains: ['onrender.com', 'render.com', 'zero6babyserver.onrender.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://imgur.com/',
      },
      {
        protocol: 'https',
        hostname: 'onrender.com',
      },
    ],
  },
}
