import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 4173);

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // 设置 E2E_SKIP_BUILD=1 可以跳过构建，直接预览现有的 dist/（CI 上先单独构建）
    command: `${process.env.E2E_SKIP_BUILD ? '' : 'npm run build && '}npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    // 冒烟测试固定按根路径构建和预览，避免环境里的 BASE_PATH 让页面挂到子路径下
    env: { BASE_PATH: '/' },
    reuseExistingServer: !process.env.CI,
  },
});
