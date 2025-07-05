import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: true
	},

	testDir: 'tests',
	use: {
		baseURL: 'http://localhost:4173',
		// 헤드리스 모드로 실행 (UI 없이)
		headless: true,
		// 스크린샷은 실패시에만
		screenshot: 'only-on-failure',
		// 비디오 녹화 비활성화
		video: 'off',
		// 추적 비활성화
		trace: 'off'
	},
	
	// 타임아웃 설정
	timeout: 30000,
	
	// 리포터 설정 - 간단한 출력만
	reporter: 'line',
	
	// 병렬 실행
	workers: process.env.CI ? 1 : 2
});
