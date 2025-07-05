import { test, expect } from '@playwright/test';

test.describe('Sticker Debug', () => {
	test('스티커 페이지 디버깅', async ({ page }) => {
		// 페이지로 이동
		await page.goto('http://localhost:6100/test/sticker');
		
		// 페이지 로드 대기
		await page.waitForLoadState('networkidle');
		
		// 콘솔 로그 모니터링
		page.on('console', msg => {
			console.log(`[${msg.type()}]`, msg.text());
		});
		
		// 첫 번째 스티커 찾기
		const firstSticker = page.locator('[draggable="true"]').first();
		await expect(firstSticker).toBeVisible();
		
		// 스티커의 실제 HTML 출력
		const stickerHTML = await firstSticker.evaluate(el => el.outerHTML);
		console.log('스티커 HTML:', stickerHTML);
		
		// 스티커의 이벤트 핸들러 확인
		const handlers = await firstSticker.evaluate((el) => {
			return {
				draggable: el.draggable,
				hasOnDragStart: !!el.ondragstart,
				hasOnDragEnd: !!el.ondragend,
				hasOnClick: !!el.onclick,
				attributes: Array.from(el.attributes).map(attr => ({
					name: attr.name,
					value: attr.value.substring(0, 50) + (attr.value.length > 50 ? '...' : '')
				}))
			};
		});
		console.log('스티커 속성:', JSON.stringify(handlers, null, 2));
		
		// 클릭 테스트
		await firstSticker.click();
		await page.waitForTimeout(1000);
		
		// 드래그 시뮬레이션
		console.log('드래그 시작...');
		await firstSticker.hover();
		await page.mouse.down();
		await page.waitForTimeout(500);
		
		// 마우스 이동
		await page.mouse.move(500, 300);
		await page.waitForTimeout(500);
		
		// 드롭
		await page.mouse.up();
		await page.waitForTimeout(1000);
		
		// 캔버스 영역 찾기
		const canvasAreas = await page.locator('div').filter({ hasText: '스티커를 드래그해서 놓으세요' }).all();
		console.log('캔버스 영역 수:', canvasAreas.length);
		
		// 스크린샷 저장
		await page.screenshot({ path: 'sticker-debug.png', fullPage: true });
	});
});