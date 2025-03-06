/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    domains: [
      'images.unsplash.com',
      'static.ticimax.cloud',
      'placehold.co',
      'www.maskemuzik.com'
    ],
  },
}

module.exports = nextConfig 