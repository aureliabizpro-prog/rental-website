/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',  // 啟用靜態導出
  basePath: isProd ? '/rental-website' : '',  // 生產環境使用 /rental-website，開發環境使用根路徑
  images: {
    unoptimized: true  // GitHub Pages 不支援 Image Optimization
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/rental-website' : ''
  }
}

module.exports = nextConfig
