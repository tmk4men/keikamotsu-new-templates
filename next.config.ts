import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/keikamotsu-new-templates',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
