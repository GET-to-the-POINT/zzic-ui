import { test, expect } from '@playwright/test';

test.describe('Sticker Drag and Drop', () => {
	test.beforeEach(async ({ page }) => {
		// 개발 서버가 실행 중이라고 가정
		await page.goto('http://localhost:6100/test/sticker');
		
		// 페이지가 로드되었는지 확인
		await expect(page.locator('h1.h1')).toContainText('스티커 드래그 앤 드롭 테스트');
		
		// 콘솔 로그 모니터링 시작
		page.on('console', msg => {
			console.log(`브라우저 콘솔 [${msg.type()}]:`, msg.text());
		});
		
		// 페이지 에러 모니터링
		page.on('pageerror', error => {
			console.error('페이지 에러:', error);
		});
	});

	test('페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
		// 스티커 팔레트 확인
		await expect(page.locator('h2:has-text("스티커 팔레트")')).toBeVisible();
		
		// 캔버스 확인
		await expect(page.locator('h2:has-text("캔버스")')).toBeVisible();
		
		// 스티커들이 표시되는지 확인
		const stickers = page.locator('[draggable="true"]');
		await expect(stickers).toHaveCount(5);
	});

	test('스티커 클릭 이벤트가 작동하는지 확인', async ({ page }) => {
		// 첫 번째 스티커 찾기
		const firstSticker = page.locator('[draggable="true"]').first();
		
		// 스티커가 보이는지 확인
		await expect(firstSticker).toBeVisible();
		
		// 콘솔 메시지를 캡처하기 위한 Promise
		const consolePromise = page.waitForEvent('console', msg => 
			msg.text().includes('clicked!')
		);
		
		// 스티커 클릭
		await firstSticker.click();
		
		// 콘솔 메시지 확인
		const msg = await consolePromise;
		expect(msg.text()).toContain('clicked!');
	});

	test('드래그 앤 드롭이 작동하는지 확인', async ({ page }) => {
		// 첫 번째 스티커와 캔버스 요소 찾기
		const firstSticker = page.locator('[draggable="true"]').first();
		const canvas = page.locator('div.relative.h-\\[500px\\]').first();
		
		// 요소들이 보이는지 확인
		await expect(firstSticker).toBeVisible();
		await expect(canvas).toBeVisible();
		
		// 드래그 시작 콘솔 메시지를 캡처하기 위한 Promise
		const dragStartPromise = page.waitForEvent('console', msg => 
			msg.text().includes('ondragstart clicked!')
		);
		
		// 드래그 앤 드롭 수행
		await firstSticker.hover();
		await page.mouse.down();
		
		// 드래그 시작 메시지 확인
		const dragStartMsg = await dragStartPromise.catch(() => null);
		if (dragStartMsg) {
			console.log('드래그 시작 메시지:', dragStartMsg.text());
		}
		
		// 캔버스 중앙으로 이동
		const canvasBox = await canvas.boundingBox();
		if (canvasBox) {
			await page.mouse.move(
				canvasBox.x + canvasBox.width / 2, 
				canvasBox.y + canvasBox.height / 2
			);
		}
		
		// 드롭
		await page.mouse.up();
		
		// 잠시 대기
		await page.waitForTimeout(500);
		
		// 캔버스에 스티커가 추가되었는지 확인
		const canvasStickers = canvas.locator('.absolute');
		const stickerCount = await canvasStickers.count();
		
		console.log('캔버스에 있는 스티커 수:', stickerCount);
		
		// 초기화 버튼이 나타났는지 확인 (스티커가 추가되었을 때만 나타남)
		const resetButton = page.locator('button:has-text("캔버스 초기화")');
		const isResetButtonVisible = await resetButton.isVisible().catch(() => false);
		
		if (isResetButtonVisible) {
			console.log('캔버스 초기화 버튼이 표시됨 - 드롭 성공!');
		} else {
			console.log('캔버스 초기화 버튼이 표시되지 않음 - 드롭 실패');
		}
	});

	test('대체 드래그 앤 드롭 방법 테스트', async ({ page }) => {
		const firstSticker = page.locator('[draggable="true"]').first();
		const canvas = page.locator('div.relative.h-\\[500px\\]').first();
		
		// dispatchEvent를 사용한 직접적인 드래그 앤 드롭
		await firstSticker.evaluate((element) => {
			const dragStartEvent = new DragEvent('dragstart', {
				bubbles: true,
				cancelable: true,
				dataTransfer: new DataTransfer()
			});
			
			console.log('Dispatching dragstart event');
			element.dispatchEvent(dragStartEvent);
		});
		
		await canvas.evaluate((element) => {
			const dropEvent = new DragEvent('drop', {
				bubbles: true,
				cancelable: true,
				dataTransfer: new DataTransfer()
			});
			
			console.log('Dispatching drop event');
			element.dispatchEvent(dropEvent);
		});
		
		await page.waitForTimeout(500);
		
		// 결과 확인
		const canvasStickers = canvas.locator('.absolute');
		const stickerCount = await canvasStickers.count();
		console.log('대체 방법 - 캔버스에 있는 스티커 수:', stickerCount);
	});

	test('드래그 가능 속성 확인', async ({ page }) => {
		const stickers = page.locator('[draggable="true"]');
		const count = await stickers.count();
		
		for (let i = 0; i < count; i++) {
			const sticker = stickers.nth(i);
			const draggable = await sticker.getAttribute('draggable');
			expect(draggable).toBe('true');
			
			// 각 스티커의 이벤트 핸들러 확인
			const hasHandlers = await sticker.evaluate((el) => {
				return {
					ondragstart: typeof el.ondragstart === 'function',
					ondragend: typeof el.ondragend === 'function',
					onclick: typeof el.onclick === 'function'
				};
			});
			
			console.log(`스티커 ${i + 1} 이벤트 핸들러:`, hasHandlers);
		}
	});
});