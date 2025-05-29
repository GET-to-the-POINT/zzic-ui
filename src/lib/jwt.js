/****
 * JWT 관련 유틸 함수 모음
 */

function base64UrlDecode(str) {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	// Base64 문자열은 4의 배수 길이를 가져야 하므로, 필요한 경우 '='로 패딩합니다.
	const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
	let decoded;

	// 환경 감지
	if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
		// Node.js 환경
		decoded = Buffer.from(padded, 'base64').toString('utf-8');
	} else if (typeof atob === 'function' && typeof TextDecoder === 'function') {
		// 브라우저 환경
		const binaryString = atob(padded); // Base64 디코딩 (binary string 반환)
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		decoded = new TextDecoder().decode(bytes); // UTF-8로 디코딩
	} else {
		// 지원되지 않는 환경
		console.error('Base64 decoding environment not supported. Neither Buffer nor atob/TextDecoder is available.');
		// 지원되지 않는 환경에서는 오류를 발생시키거나 null을 반환할 수 있습니다.
		// 여기서는 오류를 발생시켜 문제를 명확히 알립니다.
		throw new Error('Base64 decoding failed due to unsupported environment.');
	}
	return JSON.parse(decoded); // 디코딩된 문자열을 JSON으로 파싱
}

/**
 * JWT 페이로드 파싱 (검증 없이)
 * @param {string} token
 * @returns {object|null}
 */
export function parseJwtPayload(token) {
	try {
		console.log('Original token:', token); // 원본 토큰 로깅
		const parts = token.split('.');
		console.log('Token parts:', parts); // 분리된 토큰 부분들 로깅

		if (parts.length !== 3) {
			console.error('Invalid JWT: Does not contain 3 parts.');
			return null;
		}
		const payload = parts[1];
		// const [, payload] = token.split('.'); // 기존 로직 주석 처리
		if (!payload) {
			console.error('Invalid JWT: Payload is missing.');
			return null;
		}
		console.log('Encoded payload:', payload); // 인코딩된 페이로드 로깅
		const decodedPayload = base64UrlDecode(payload);
		console.log('Decoded payload:', decodedPayload); // 디코딩된 페이로드 로깅
		return decodedPayload;
	} catch (e) {
		console.error('Invalid JWT format or decoding failed:', e);
		return null;
	}
}

/**
 * 쿠키에서 JWT를 파싱하여 유저 객체 생성 (검증 없음)
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @returns {object|null}
 */
export function getUserFromCookies(cookies) {
	const tokenArray = cookies.getAll?.().getAll ?? [];
	const tokenValue = tokenArray.find(c => c.name === 'Authorization')?.value;

	if (!tokenValue) return null;

	const payload = parseJwtPayload(tokenValue);
	if (!payload) return null;

	return payload;
}