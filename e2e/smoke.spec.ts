import { expect, test } from '@playwright/test';

test('页面能打开并显示 25:00', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('专注番茄');
  await expect(page.getByTestId('time')).toHaveText('25:00');
});
