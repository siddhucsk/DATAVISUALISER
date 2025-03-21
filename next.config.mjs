/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: process.env.NODE_ENV === 'development' ? '' : '/DATAVISUALISER', // Only use basePath in production
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig; 