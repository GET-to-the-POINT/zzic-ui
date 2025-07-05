import { defineConfig } from '@playwright/test';

export default defineConfig({
	// 개발 서버 사용
	webServer: {
		command: 'npm run dev -- --port 6100',
		port: 6100,
		reuseExistingServer: true,
		timeout: 120000
	},

	testDir: 'e2e',
	
	// 테스트 타임아웃
	timeout: 30000,

	// 브라우저 설정
	use: {
		// 개발 서버 URL
		baseURL: 'http://localhost:6100',
		
		// 스크린샷 설정
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		
		// 브라우저 옵션
		headless: true, // 헤드리스 모드
		slowMo: 0, // 딜레이 제거
	},

	// 리포터 설정
	reporter: [
		['list'],
		['html', { open: 'never' }]
	],

	// 프로젝트 설정
	projects: [
		{
			name: 'chromium',
			use: { ...defineConfig.use }
		}
	]
});