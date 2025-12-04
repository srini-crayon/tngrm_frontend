/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'agentsstore.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  // Ensure proper module resolution
  experimental: {
    esmExternals: true,
  },
  // Rewrites for both development and production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://agents-store.onrender.com/api/:path*',
      },
    ]
  },
}

export default nextConfig
