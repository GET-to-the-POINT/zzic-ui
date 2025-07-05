import { test, expect } from '@playwright/test';

test.describe('루트 페이지 테스트', () => {
	test('루트 페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
		// 루트 페이지로 이동
		await page.goto('http://localhost:6100/');
		
		// 페이지가 완전히 로드될 때까지 대기
		await page.waitForLoadState('networkidle');
		
		// 콘솔 에러 모니터링
		const consoleErrors = [];
		page.on('console', msg => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});
		
		// 페이지 에러 모니터링
		const pageErrors = [];
		page.on('pageerror', error => {
			pageErrors.push(error.message);
		});
		
		// 기본 요소들이 표시되는지 확인
		// 메인 콘텐츠 영역 확인 (모든 페이지에 있어야 함)
		const main = page.locator('main').first();
		await expect(main).toBeVisible({ timeout: 10000 });
		
		// 헤더가 있는지 확인 (로그인 페이지는 헤더가 없을 수 있음)
		const header = page.locator('header').first();
		const hasHeader = await header.count() > 0;
		console.log('헤더 존재:', hasHeader);
		
		// 네비게이션 요소 확인
		const nav = page.locator('nav').first();
		const hasNav = await nav.count() > 0;
		console.log('네비게이션 존재:', hasNav);
		
		// 페이지 타이틀 확인
		const title = await page.title();
		console.log('페이지 타이틀:', title);
		expect(title).toBeTruthy();
		
		// URL 확인 (리다이렉트 확인)
		const currentUrl = page.url();
		console.log('현재 URL:', currentUrl);
		
		// 로그인 여부에 따른 리다이렉트 확인
		if (currentUrl.includes('/auth/sign-in')) {
			console.log('로그인 페이지로 리다이렉트됨');
			
			// 로그인 페이지 요소 확인
			const signInForm = page.locator('form').first();
			await expect(signInForm).toBeVisible();
			
			// 이메일/비밀번호 입력 필드 확인
			const emailInput = page.locator('input[type="email"], input[name="email"]').first();
			const passwordInput = page.locator('input[type="password"]').first();
			
			await expect(emailInput).toBeVisible();
			await expect(passwordInput).toBeVisible();
		} else if (currentUrl.includes('/dashboard')) {
			console.log('대시보드로 리다이렉트됨');
			
			// 대시보드 요소 확인
			const dashboard = page.locator('[class*="dashboard"], main').first();
			await expect(dashboard).toBeVisible();
		}
		
		// 에러 확인
		if (consoleErrors.length > 0) {
			console.log('콘솔 에러:', consoleErrors);
		}
		if (pageErrors.length > 0) {
			console.log('페이지 에러:', pageErrors);
		}
		
		// 스크린샷 저장
		await page.screenshot({ path: 'root-page-screenshot.png', fullPage: true });
		
		// 에러가 없어야 함
		expect(consoleErrors.length).toBe(0);
		expect(pageErrors.length).toBe(0);
	});
	
	test('필수 정적 자원이 로드되는지 확인', async ({ page }) => {
		const failedRequests = [];
		
		// 네트워크 요청 모니터링
		page.on('requestfailed', request => {
			failedRequests.push({
				url: request.url(),
				failure: request.failure()
			});
		});
		
		// 루트 페이지로 이동
		await page.goto('http://localhost:6100/');
		await page.waitForLoadState('networkidle');
		
		// CSS 파일이 로드되는지 확인
		const styles = await page.$$('link[rel="stylesheet"]');
		console.log('스타일시트 수:', styles.length);
		expect(styles.length).toBeGreaterThan(0);
		
		// JavaScript 파일이 로드되는지 확인
		const scripts = await page.$$('script[src]');
		console.log('스크립트 수:', scripts.length);
		expect(scripts.length).toBeGreaterThan(0);
		
		// 실패한 요청 확인
		if (failedRequests.length > 0) {
			console.log('실패한 요청들:', failedRequests);
		}
		
		expect(failedRequests.length).toBe(0);
	});
	
	test('반응형 디자인 테스트', async ({ page }) => {
		// 데스크톱 뷰
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto('http://localhost:6100/');
		await page.waitForLoadState('networkidle');
		
		const desktopScreenshot = await page.screenshot({ 
			path: 'root-page-desktop.png',
			fullPage: false 
		});
		
		// 태블릿 뷰
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.waitForTimeout(500); // 리사이즈 애니메이션 대기
		
		const tabletScreenshot = await page.screenshot({ 
			path: 'root-page-tablet.png',
			fullPage: false 
		});
		
		// 모바일 뷰
		await page.setViewportSize({ width: 375, height: 667 });
		await page.waitForTimeout(500); // 리사이즈 애니메이션 대기
		
		const mobileScreenshot = await page.screenshot({ 
			path: 'root-page-mobile.png',
			fullPage: false 
		});
		
		// 모바일에서 햄버거 메뉴나 모바일 네비게이션 확인
		const mobileNav = page.locator('[class*="mobile"], [class*="burger"], [class*="menu-button"]').first();
		const hasMobileNav = await mobileNav.count() > 0;
		console.log('모바일 네비게이션 존재:', hasMobileNav);
	});
});