import { test, expect } from '@playwright/test';

test('수동 드래그 앤 드롭 테스트', async ({ page }) => {
	// 페이지로 이동
	await page.goto('http://localhost:6100/test/sticker');
	
	// 페이지 로드 확인
	await expect(page.locator('h1.h1')).toContainText('스티커 드래그 앤 드롭 테스트');
	
	// 콘솔 로그 캡처
	const consoleLogs = [];
	page.on('console', msg => {
		const text = msg.text();
		consoleLogs.push(text);
		console.log(`[${msg.type()}]`, text);
	});
	
	// 첫 번째 스티커와 캔버스 찾기
	const firstSticker = page.locator('[draggable="true"]').first();
	const canvas = page.locator('.h-\\[500px\\]').first();
	
	// 위치 확인
	const stickerBox = await firstSticker.boundingBox();
	const canvasBox = await canvas.boundingBox();
	
	console.log('스티커 위치:', stickerBox);
	console.log('캔버스 위치:', canvasBox);
	
	// Playwright의 dragTo 메서드를 사용하여 실제 드래그 수행
	console.log('=== 실제 드래그 앤 드롭 시작 ===');
	
	// 스티커의 중심점 계산
	const stickerCenter = {
		x: stickerBox.x + stickerBox.width / 2,
		y: stickerBox.y + stickerBox.height / 2
	};
	
	// 캔버스의 중심점 계산
	const canvasCenter = {
		x: canvasBox.x + canvasBox.width / 2,
		y: canvasBox.y + canvasBox.height / 2
	};
	
	// 마우스 이벤트로 드래그 시뮬레이션
	await page.mouse.move(stickerCenter.x, stickerCenter.y);
	await page.mouse.down();
	await page.waitForTimeout(100);
	
	// 중간 지점으로 이동
	await page.mouse.move(
		(stickerCenter.x + canvasCenter.x) / 2,
		(stickerCenter.y + canvasCenter.y) / 2,
		{ steps: 5 }
	);
	await page.waitForTimeout(100);
	
	// 캔버스로 이동
	await page.mouse.move(canvasCenter.x, canvasCenter.y, { steps: 5 });
	await page.waitForTimeout(100);
	
	// 드롭
	await page.mouse.up();
	
	await page.waitForTimeout(1000);
	
	// 결과 확인
	const canvasStickers = await canvas.locator('.absolute').count();
	const resetButton = await page.locator('button:has-text("캔버스 초기화")').isVisible();
	
	console.log('=== 결과 ===');
	console.log('캔버스의 스티커 수:', canvasStickers);
	console.log('초기화 버튼 표시:', resetButton);
	console.log('드래그 관련 로그:', consoleLogs.filter(log => 
		log.includes('drag') || log.includes('Drag') || log.includes('Drop')
	));
});