/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
    NEXT_PUBLIC_ANALYTICS_ENDPOINT: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Performance optimizations
  experimental: {
    // Use Turbopack for faster dev builds (5-10x faster)
    turbo: {
      rules: {},
    },
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  // Faster incremental builds
  typescript: {
    // Type check in parallel (faster builds)
    tsconfigPath: './tsconfig.json',
  },
  // Optimize webpack in dev (fallback when not using Turbopack)
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Faster rebuilds in dev
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig
