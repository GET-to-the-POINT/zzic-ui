import { browser } from '$app/environment';

/**
 * 사용 가능한 테마 목록
 */
export const themes = [
	{ name: 'pinky', label: '핑키' },
	{ name: 'catppuccin', label: '카푸치노' },
	{ name: 'cerberus', label: '세르베루스' },
	{ name: 'concord', label: '콩코드' },
	{ name: 'crimson', label: '크림슨' },
	{ name: 'fennec', label: '페넥' },
	{ name: 'hamlindigo', label: '햄린디고' },
	{ name: 'legacy', label: '레거시' },
	{ name: 'mint', label: '민트' },
	{ name: 'modern', label: '모던' },
	{ name: 'mona', label: '모나' },
	{ name: 'nosh', label: '노시' },
	{ name: 'nouveau', label: '누보' },
	{ name: 'pine', label: '파인' },
	{ name: 'reign', label: '레인' },
	{ name: 'rocket', label: '로켓' },
	{ name: 'rose', label: '로즈' },
	{ name: 'sahara', label: '사하라' },
	{ name: 'seafoam', label: '시폼' },
	{ name: 'terminus', label: '터미너스' },
	{ name: 'vintage', label: '빈티지' },
	{ name: 'vox', label: '복스' },
	{ name: 'wintry', label: '윈터리' }
];

/**
 * 현재 테마 가져오기
 */
export function getCurrentTheme() {
	if (!browser) return 'pinky';
	return localStorage.getItem('theme') || 'pinky';
}

/**
 * 테마 설정하기
 */
export function setTheme(theme) {
	if (!browser) return;
	
	const html = document.documentElement;
	html.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);
}

/**
 * 테마 초기화 (앱 시작 시 호출)
 */
export function initializeTheme() {
	if (!browser) return;
	
	const savedTheme = localStorage.getItem('theme') || 'pinky';
	setTheme(savedTheme);
}