/**
 * @typedef {Object} CookieOptions
 * @property {string} [path] - 쿠키 경로
 * @property {Date} [expires] - 쿠키 만료일
 * @property {number} [maxAge] - 쿠키 최대 수명 (초)
 * @property {boolean} [httpOnly] - HTTP 전용 플래그
 * @property {boolean} [secure] - 보안 플래그
 * @property {'strict'|'lax'|'none'} [sameSite] - SameSite 속성
 * @property {string} [domain] - 쿠키 도메인
 */

/**
 * @typedef {Object} ParsedCookie
 * @property {string} name - 쿠키 이름
 * @property {string} value - 쿠키 값
 * @property {CookieOptions} options - 쿠키 옵션
 */

/**
 * Set-Cookie 헤더를 파싱하여 SvelteKit 쿠키 형식으로 변환
 * @param {string} setCookieHeader - Set-Cookie 헤더 문자열
 * @returns {Array<ParsedCookie>} 파싱된 쿠키 배열
 */
export function parseSetCookieHeader(setCookieHeader) {
	if (!setCookieHeader) return [];
	
	/** @type {Array<ParsedCookie>} */
	const results = [];
	
	setCookieHeader
		.split(/,(?=\s*[^;=\s]+=)/) // 쿠키 구분자로 분리 (날짜의 쉼표와 구분)
		.forEach(/** @param {string} cookie */ (cookie) => {
			const parts = cookie.trim().split(';').map(/** @param {string} p */ (p) => p.trim());
			const [name, value] = parts[0].split('=');

			if (!name) return;

			/** @type {CookieOptions} */
			const options = {};
			
			for (let i = 1; i < parts.length; i++) {
				const [optKey, optVal] = parts[i].split('=');
				const key = optKey.toLowerCase();
				
				switch (key) {
					case 'path':
						options.path = optVal;
						break;
					case 'expires':
						options.expires = new Date(optVal);
						break;
					case 'max-age':
						options.maxAge = parseInt(optVal, 10);
						break;
					case 'secure':
						options.secure = true;
						break;
					case 'httponly':
						options.httpOnly = true;
						break;
					case 'samesite': {
						const sameSiteValue = optVal?.toLowerCase();
						if (sameSiteValue === 'strict' || sameSiteValue === 'lax' || sameSiteValue === 'none') {
								options.sameSite = sameSiteValue;
							}
							break;
						}
						case 'domain':
							options.domain = optVal;
							break;
					}
				}
			}
			
			results.push({
				name: name.trim(),
				value: value.trim(),
				options
			});
		});
	
	return results;
}

/**
 * 응답에서 Set-Cookie 헤더를 추출하고 SvelteKit 쿠키 객체에 적용하는 래퍼 클래스
 */
export class ResponseCookieManager {
	/** @type {import('@sveltejs/kit').Cookies} */
	#cookies;
	
	/**
	 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit 쿠키 객체
	 */
	constructor(cookies) {
		this.#cookies = cookies;
	}
	
	/**
	 * Response에서 Set-Cookie 헤더를 추출하여 쿠키를 설정
	 * @param {Response} response - HTTP 응답 객체
	 * @returns {boolean} 쿠키 설정 성공 여부
	 */
	applyFromResponse(response) {
		try {
			const setCookieHeader = response.headers.get('set-cookie');
			if (!setCookieHeader) return false;
			
			return this.applyFromHeader(setCookieHeader);
		} catch (error) {
			console.warn('응답에서 쿠키 적용 실패:', error);
			return false;
		}
	}
	
	/**
	 * Set-Cookie 헤더 문자열에서 쿠키를 설정
	 * @param {string} setCookieHeader - Set-Cookie 헤더 문자열
	 * @returns {boolean} 쿠키 설정 성공 여부
	 */
	applyFromHeader(setCookieHeader) {
		try {
			const parsedCookies = parseSetCookieHeader(setCookieHeader);
			
			parsedCookies.forEach(/** @param {ParsedCookie} cookie */ (cookie) => {
				/** @type {any} */
				const cookieOptions = {
					path: cookie.options.path || '/',
					httpOnly: cookie.options.httpOnly || false,
					secure: cookie.options.secure || false,
					};

					// 선택적 속성들 추가
					if (cookie.options.expires) cookieOptions.expires = cookie.options.expires;
					if (cookie.options.maxAge) cookieOptions.maxAge = cookie.options.maxAge;
					if (cookie.options.sameSite) cookieOptions.sameSite = cookie.options.sameSite;
					if (cookie.options.domain) cookieOptions.domain = cookie.options.domain;

					this.#cookies.set(cookie.name, cookie.value, cookieOptions);
			});
			
			return parsedCookies.length > 0;
		} catch (error) {
			console.warn('Set-Cookie 헤더에서 쿠키 적용 실패:', error);
			return false;
		}
	}
	
	/**
	 * 쿠키 배열을 한 번에 설정
	 * @param {Array<{name: string, value: string, options?: CookieOptions}>} cookiesToSet - 설정할 쿠키 배열
	 */
	setAll(cookiesToSet) {
		cookiesToSet.forEach(/** @param {{name: string, value: string, options?: CookieOptions}} cookieItem */ ({ name, value, options = {} }) => {
			try {
				this.#cookies.set(name, value, { path: '/', ...options });
			} catch (error) {
				console.warn(`쿠키 설정 실패 (${name}):`, error);
			}
		});
	}
}