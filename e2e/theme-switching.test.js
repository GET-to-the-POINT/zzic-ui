import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the menu page
		await page.goto('/menu');
	});

	test('should display theme change button in menu', async ({ page }) => {
		const themeButton = page.locator('a[href="/theme"]');
		await expect(themeButton).toBeVisible();
		await expect(themeButton).toContainText('테마 변경');
	});

	test('should open theme modal when clicking theme button', async ({ page }) => {
		// Click theme change button
		await page.click('a[href="/theme"]');
		
		// Check if modal is open
		await expect(page.locator('.modal-backdrop')).toBeVisible();
		await expect(page.locator('.modal-content')).toBeVisible();
		await expect(page.locator('h2:has-text("테마 변경")')).toBeVisible();
	});

	test('should display all available themes', async ({ page }) => {
		await page.goto('/theme');
		
		// Check if all themes are displayed
		const expectedThemes = [
			'스켈레톤', '윈터리', '모던', '햄린디고', '로켓', '사하라',
			'골드 누보', '빈티지', '시폼', '크림슨', '핑키'
		];
		
		for (const theme of expectedThemes) {
			await expect(page.locator(`.theme-label:has-text("${theme}")`)).toBeVisible();
		}
	});

	test('should have skeleton theme selected by default', async ({ page }) => {
		await page.goto('/theme');
		
		// Check if skeleton theme is selected
		const skeletonTheme = page.locator('.theme-item:has-text("스켈레톤")');
		await expect(skeletonTheme).toHaveClass(/selected/);
		await expect(skeletonTheme.locator('.check-icon')).toBeVisible();
	});

	test('should switch theme when clicking on theme option', async ({ page }) => {
		await page.goto('/theme');
		
		// Click on wintry theme
		await page.click('.theme-item:has-text("윈터리")');
		
		// Check if theme is applied
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'wintry');
		
		// Check if theme is selected in UI
		const wintryTheme = page.locator('.theme-item:has-text("윈터리")');
		await expect(wintryTheme).toHaveClass(/selected/);
		await expect(wintryTheme.locator('.check-icon')).toBeVisible();
	});

	test('should persist theme selection in localStorage', async ({ page }) => {
		await page.goto('/theme');
		
		// Select crimson theme
		await page.click('.theme-item:has-text("크림슨")');
		
		// Check localStorage
		const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
		expect(savedTheme).toBe('crimson');
	});

	test('should maintain theme after page refresh', async ({ page }) => {
		await page.goto('/theme');
		
		// Select pinky theme
		await page.click('.theme-item:has-text("핑키")');
		
		// Refresh page
		await page.reload();
		
		// Check if theme is still applied
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'pinky');
		
		// Navigate to theme page and check selection
		await page.goto('/theme');
		const pinkyTheme = page.locator('.theme-item:has-text("핑키")');
		await expect(pinkyTheme).toHaveClass(/selected/);
	});

	test('should close modal when clicking close button', async ({ page }) => {
		await page.goto('/theme');
		
		// Click close button
		await page.click('.btn-icon');
		
		// Check if redirected to menu
		await expect(page).toHaveURL('/menu');
	});

	test('should close modal when clicking confirm button', async ({ page }) => {
		await page.goto('/theme');
		
		// Click confirm button
		await page.click('button:has-text("확인")');
		
		// Check if redirected to menu
		await expect(page).toHaveURL('/menu');
	});

	test('should close modal when clicking cancel button', async ({ page }) => {
		await page.goto('/theme');
		
		// Click cancel button
		await page.click('button:has-text("취소")');
		
		// Check if redirected to menu
		await expect(page).toHaveURL('/menu');
	});

	test('should be scrollable when content overflows', async ({ page }) => {
		await page.goto('/theme');
		
		// Check if modal body is scrollable
		const modalBody = page.locator('.modal-body');
		await expect(modalBody).toBeVisible();
		
		// Check if all themes are accessible (scroll test)
		const lastTheme = page.locator('.theme-item:has-text("핑키")');
		await expect(lastTheme).toBeVisible();
	});

	test('should be responsive on mobile viewport', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/theme');
		
		// Check if modal is properly sized
		const modalContent = page.locator('.modal-content');
		await expect(modalContent).toBeVisible();
		
		// Check if themes are still clickable
		await page.click('.theme-item:has-text("윈터리")');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'wintry');
	});

	test('should apply theme globally across the app', async ({ page }) => {
		await page.goto('/theme');
		
		// Select sahara theme
		await page.click('.theme-item:has-text("사하라")');
		
		// Navigate to different pages and check theme
		await page.goto('/dashboard');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'sahara');
		
		await page.goto('/todos');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'sahara');
		
		await page.goto('/menu');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'sahara');
	});
});