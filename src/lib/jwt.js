/****
 * JWT 관련 유틸 함수 모음
 */

/**
 * Base64URL 디코딩 함수
 * @param {string} str - Base64URL 인코딩된 문자열
 * @returns {object} 디코딩된 JSON 객체
 */
function base64UrlDecode(str) {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
	let decoded;

	if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
		// Node.js 환경
		decoded = Buffer.from(padded, 'base64').toString('utf-8');
	} else if (typeof atob === 'function' && typeof TextDecoder === 'function') {
		// 브라우저 환경
		const binaryString = atob(padded);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		decoded = new TextDecoder().decode(bytes);
	} else {
		throw new Error('Base64 decoding failed due to unsupported environment.');
	}
	return JSON.parse(decoded);
}

/**
 * JWT 페이로드 파싱 (검증 없이)
 * @param {string} token - JWT 토큰
 * @returns {object|null} 파싱된 페이로드 또는 null
 */
export function parseJwtPayload(token) {
	try {
		const parts = token.split('.');

		if (parts.length !== 3) {
			return null;
		}

		const payload = parts[1];
		if (!payload) {
			return null;
		}

		return base64UrlDecode(payload);
	} catch {
		return null;
	}
}

/**
 * 쿠키에서 JWT를 파싱하여 유저 객체 생성 (검증 없음)
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit 쿠키 객체
 * @returns {object|null} 파싱된 유저 객체 또는 null
 */
export function getUserFromCookies(cookies) {
	const tokenArray = cookies.getAll?.().getAll ?? [];
	const tokenValue = tokenArray.find(/** @param {{ name: string; value: string; }} c */ c => c.name === 'Authorization')?.value;

	if (!tokenValue) return null;

	const payload = parseJwtPayload(tokenValue);
	if (!payload) return null;

	return payload;
}