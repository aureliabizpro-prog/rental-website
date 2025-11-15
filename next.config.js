/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 啟用靜態導出
  basePath: '/rental-website',  // GitHub Pages 子路徑
  images: {
    unoptimized: true  // GitHub Pages 不支援 Image Optimization
  }
}

module.exports = nextConfig
