/**
 * 사용자 설정 관리 유틸리티
 */

/**
 * @typedef {Object} UserSettings
 * @property {boolean} focusMode - 집중 모드 활성화 여부
 * @property {boolean} darkMode - 다크 모드 활성화 여부
 * @property {string} sidebarCollapsed - 사이드바 축소 여부
 */

/** @type {UserSettings} */
const DEFAULT_SETTINGS = {
	focusMode: false,
	darkMode: false,
	sidebarCollapsed: 'false'
};

/**
 * 설정 객체를 JSON 문자열로 직렬화
 * @param {UserSettings} settings - 설정 객체
 * @returns {string} JSON 문자열
 */
export function serializeSettings(settings) {
	try {
		return JSON.stringify(settings);
	} catch (error) {
		console.warn('설정 직렬화 실패:', error);
		return JSON.stringify(DEFAULT_SETTINGS);
	}
}

/**
 * JSON 문자열을 설정 객체로 역직렬화
 * @param {string} settingsString - JSON 문자열
 * @returns {UserSettings} 설정 객체
 */
export function deserializeSettings(settingsString) {
	try {
		if (!settingsString) return { ...DEFAULT_SETTINGS };
		const parsed = JSON.parse(settingsString);
		return { ...DEFAULT_SETTINGS, ...parsed };
	} catch (error) {
		console.warn('설정 역직렬화 실패:', error);
		return { ...DEFAULT_SETTINGS };
	}
}

/**
 * 브라우저에서 설정 쿠키 읽기
 * @returns {UserSettings} 설정 객체
 */
export function getSettingsFromBrowser() {
	if (typeof document === 'undefined') return { ...DEFAULT_SETTINGS };

	try {
		const cookies = document.cookie.split(';');
		const settingsCookie = cookies.find((cookie) => cookie.trim().startsWith('settings='));

		if (!settingsCookie) return { ...DEFAULT_SETTINGS };

		const settingsValue = decodeURIComponent(settingsCookie.split('=')[1]);
		return deserializeSettings(settingsValue);
	} catch (error) {
		console.warn('브라우저 설정 읽기 실패:', error);
		return { ...DEFAULT_SETTINGS };
	}
}

/**
 * 브라우저에서 설정 쿠키 저장
 * @param {UserSettings} settings - 저장할 설정
 */
export function saveSettingsToBrowser(settings) {
	if (typeof document === 'undefined') return;

	try {
		const settingsString = serializeSettings(settings);
		const expires = new Date();
		expires.setFullYear(expires.getFullYear() + 1); // 1년 후 만료

		document.cookie = `settings=${encodeURIComponent(settingsString)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
	} catch (error) {
		console.warn('브라우저 설정 저장 실패:', error);
	}
}

/**
 * SvelteKit 쿠키에서 설정 읽기
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit 쿠키 객체
 * @returns {UserSettings} 설정 객체
 */
export function getSettingsFromCookies(cookies) {
	try {
		const settingsString = cookies.get('settings');
		return deserializeSettings(settingsString || '');
	} catch (error) {
		console.warn('쿠키 설정 읽기 실패:', error);
		return { ...DEFAULT_SETTINGS };
	}
}

/**
 * SvelteKit 쿠키에 설정 저장
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit 쿠키 객체
 * @param {UserSettings} settings - 저장할 설정
 */
export function saveSettingsToCookies(cookies, settings) {
	try {
		const settingsString = serializeSettings(settings);
		const expires = new Date();
		expires.setFullYear(expires.getFullYear() + 1); // 1년 후 만료

		cookies.set('settings', settingsString, {
			path: '/',
			expires,
			sameSite: 'lax',
			httpOnly: false // 클라이언트에서도 접근 가능하도록
		});
	} catch (error) {
		console.warn('쿠키 설정 저장 실패:', error);
	}
}

/**
 * 설정의 특정 속성 업데이트
 * @param {UserSettings} currentSettings - 현재 설정
 * @param {Partial<UserSettings>} updates - 업데이트할 속성들
 * @returns {UserSettings} 업데이트된 설정
 */
export function updateSettings(currentSettings, updates) {
	return { ...currentSettings, ...updates };
}
