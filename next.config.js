/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 啟用靜態導出
  images: {
    unoptimized: true  // GitHub Pages 不支援 Image Optimization
  }
}

module.exports = nextConfig
