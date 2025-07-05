import { test, expect } from '@playwright/test';

test('루트 페이지 구조 확인', async ({ page }) => {
	// 루트 페이지로 이동
	await page.goto('http://localhost:6100/');
	await page.waitForLoadState('networkidle');
	
	// 페이지 타이틀
	const title = await page.title();
	console.log('페이지 타이틀:', title);
	
	// URL 확인
	const url = page.url();
	console.log('현재 URL:', url);
	
	// body가 있는지 확인
	const body = await page.$('body');
	expect(body).toBeTruthy();
	
	// 모든 최상위 요소 확인
	const topLevelElements = await page.evaluate(() => {
		const elements = [];
		document.body.childNodes.forEach(node => {
			if (node.nodeType === 1) { // Element node
				elements.push({
					tagName: node.tagName,
					id: node.id || '(no id)',
					className: node.className || '(no class)',
					textContent: node.textContent?.substring(0, 50) + '...'
				});
			}
		});
		return elements;
	});
	
	console.log('최상위 요소들:', JSON.stringify(topLevelElements, null, 2));
	
	// 페이지에 보이는 텍스트 확인
	const visibleText = await page.textContent('body');
	console.log('페이지 텍스트 (처음 200자):', visibleText?.substring(0, 200));
	
	// 특정 텍스트가 있는지 확인
	if (url.includes('/auth/sign-in')) {
		// 로그인 페이지 확인
		await expect(page.locator('text=목표를 현실로')).toBeVisible();
		console.log('✅ 로그인 페이지 확인됨');
	} else if (url.includes('/dashboard')) {
		// 대시보드 페이지 확인
		console.log('✅ 대시보드 페이지로 리다이렉트됨');
	}
	
	// 스크린샷
	await page.screenshot({ path: 'root-page-structure.png', fullPage: true });
});