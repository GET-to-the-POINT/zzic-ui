import { test, expect } from '@playwright/test';

test.describe('Search Page', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to search page
		await page.goto('/search');
	});

	test('should display search page with search input', async ({ page }) => {
		// Check if search input is visible
		await expect(page.locator('input[name="keyword"]')).toBeVisible();
		
		// Check if search icon is visible
		await expect(page.locator('svg')).toBeVisible();
		
		// Check if main container is present
		await expect(page.locator('main')).toBeVisible();
	});

	test('should have proper page structure', async ({ page }) => {
		// Check if main element has correct classes
		const main = page.locator('main');
		await expect(main).toHaveClass(/p-4 space-y-4/);
		
		// Check if search form is inside a card
		await expect(page.locator('.card')).toBeVisible();
		
		// Check if TodoList component is rendered
		await expect(page.locator('main > div:nth-child(2)')).toBeVisible();
	});

	test('should handle empty search results', async ({ page }) => {
		// Search for something that likely won't exist
		await page.fill('input[name="keyword"]', 'nonexistentitem12345');
		
		// Wait for the search to process
		await page.waitForTimeout(1000);
		
		// Should show "no todos" message
		await expect(page.locator('text=할 일이 없습니다')).toBeVisible();
	});

	test('should update URL when typing in search input', async ({ page }) => {
		// Type in search input
		await page.fill('input[name="keyword"]', 'test');
		
		// Wait for form submission
		await page.waitForTimeout(500);
		
		// Check if URL contains the search keyword
		await expect(page.url()).toContain('keyword=test');
	});

	test('should preserve search keyword in input from URL', async ({ page }) => {
		// Navigate with search parameter
		await page.goto('/search?keyword=테스트');
		
		// Check if input has the value from URL
		await expect(page.locator('input[name="keyword"]')).toHaveValue('테스트');
	});

	test('should trigger search on input', async ({ page }) => {
		const input = page.locator('input[name="keyword"]');
		
		// Type in the input
		await input.fill('할 일');
		
		// Check that the form submission happens (URL should update)
		await page.waitForTimeout(500);
		await expect(page.url()).toContain('keyword=%ED%95%A0+%EC%9D%BC');
	});

	test('should maintain focus during search', async ({ page }) => {
		const input = page.locator('input[name="keyword"]');
		
		// Focus on input
		await input.focus();
		
		// Type and trigger search
		await input.fill('search term');
		await page.waitForTimeout(500);
		
		// Input should still be focused due to data-sveltekit-keepfocus
		await expect(input).toBeFocused();
	});

	test('should use replacestate for navigation', async ({ page }) => {
		// Navigate to search with initial keyword
		await page.goto('/search?keyword=initial');
		
		// Change search term
		await page.fill('input[name="keyword"]', 'updated');
		await page.waitForTimeout(500);
		
		// Go back - should go to previous page, not previous search
		// This tests data-sveltekit-replacestate behavior
		const initialUrl = page.url();
		await page.goBack();
		
		// Should not be on the search page with 'initial' keyword
		const currentUrl = page.url();
		expect(currentUrl).not.toContain('keyword=initial');
	});

	test('should handle special characters in search', async ({ page }) => {
		// Test with Korean text
		await page.fill('input[name="keyword"]', '할 일 테스트');
		await page.waitForTimeout(500);
		
		// URL should be properly encoded
		expect(page.url()).toContain('keyword=');
		
		// Input should still show the original text
		await expect(page.locator('input[name="keyword"]')).toHaveValue('할 일 테스트');
	});

	test('should handle rapid typing', async ({ page }) => {
		const input = page.locator('input[name="keyword"]');
		
		// Type rapidly
		await input.type('rapid typing test', { delay: 50 });
		
		// Wait for debouncing/final submission
		await page.waitForTimeout(1000);
		
		// Should have the complete text in URL
		await expect(page.url()).toContain('rapid+typing+test');
	});
});