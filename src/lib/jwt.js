/**
 * JWT 관련 유틸 함수 모음
 */

function base64UrlDecode(str) {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
	const decoded = Buffer.from(padded, 'base64').toString('utf-8');
	return JSON.parse(decoded);
}

/**
 * JWT 페이로드 파싱 (검증 없이)
 * @param {string} token
 * @returns {object|null}
 */
export function parseJwtPayload(token) {
	try {
		const [, payload] = token.split('.');
		if (!payload) return null;
		return base64UrlDecode(payload);
	} catch (e) {
		console.error('Invalid JWT format or decoding failed:', e);
		return null;
	}
}
