/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  // 部署到 GitHub Pages 时设置 BASE_PATH=/仓库名/
  base: process.env.BASE_PATH ?? '/',
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
