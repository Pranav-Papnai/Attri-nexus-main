import { test, expect } from '@playwright/test';

test.describe('Attri Nexus Web Application E2E Tests', () => {

  test('Homepage loads with branding and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Attri Nexus/i);
    await expect(page.getByText('ATTRI NEXUS', { exact: false }).first()).toBeVisible({ timeout: 15000 });
  });

  test('Products catalogue loads and displays products', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByText(/Core Commodities|Catalogue|Products/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('About Us page loads company information', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText(/About Attri Nexus|Heritage|Story/i).first()).toBeVisible({ timeout: 15000 });
  });

});
