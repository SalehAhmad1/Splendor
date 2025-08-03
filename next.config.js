/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone instead of export for server-side functionality
  output: 'standalone',
  
  // Ensure images are properly handled
  images: {
    unoptimized: true,
  },
  
  // Explicitly enable API routes
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
