import { test, expect } from '@playwright/test';

test('스티커 드래그 앤 드롭 실제 테스트', async ({ page }) => {
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
	
	// 초기 상태 확인
	await expect(firstSticker).toBeVisible();
	await expect(canvas).toBeVisible();
	
	console.log('=== 드래그 앤 드롭 시작 ===');
	
	// 드래그 앤 드롭 수행
	await firstSticker.dragTo(canvas);
	
	// 잠시 대기
	await page.waitForTimeout(1000);
	
	// 로그 확인
	const dragStartLog = consoleLogs.find(log => log.includes('Action: dragstart!'));
	const dropLog = consoleLogs.find(log => log.includes('Drop on canvas'));
	
	console.log('드래그 시작 로그:', dragStartLog);
	console.log('드롭 로그:', dropLog);
	
	// 캔버스에 스티커가 추가되었는지 확인
	const canvasStickers = canvas.locator('.absolute');
	const stickerCount = await canvasStickers.count();
	
	console.log('캔버스의 스티커 수:', stickerCount);
	
	// 초기화 버튼 확인
	const resetButton = page.locator('button:has-text("캔버스 초기화")');
	const isResetVisible = await resetButton.isVisible();
	
	console.log('초기화 버튼 표시 여부:', isResetVisible);
	
	// 스크린샷 저장
	await page.screenshot({ path: 'drag-drop-result.png', fullPage: true });
	
	// 테스트 결과
	if (stickerCount > 0 || isResetVisible) {
		console.log('✅ 드래그 앤 드롭 성공!');
	} else {
		console.log('❌ 드래그 앤 드롭 실패');
	}
});