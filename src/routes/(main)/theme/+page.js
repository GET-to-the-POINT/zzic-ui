import ThemeContextMenu from './ThemeContextMenu.svelte';
import { getCurrentTheme, setTheme } from '$lib/utils/theme.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
	// 원래 테마 저장
	const originalTheme = getCurrentTheme();

	return {
		meta: {
			title: '테마 변경',
			description: '앱 테마를 변경하세요',
			modal: true
		},
		contextMenu: ThemeContextMenu,
		originalTheme,
		handleBack: (event, defaultBack) => {
			// 테마 복구 후 기본 뒤로가기 실행
			console.log('테마 페이지: 원래 테마로 복구 중...');
			setTheme(originalTheme);

			// 기본 뒤로가기 실행
			defaultBack(event);
		}
	};
}
