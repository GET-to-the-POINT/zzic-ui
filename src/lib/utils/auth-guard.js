import { redirect } from '@sveltejs/kit';

/**
 * 인증 가드 유틸리티
 * 사용자가 인증되지 않은 경우 로그인 페이지로 리디렉트
 * 
 * @param {object} parent - parent() 함수에서 받은 데이터
 * @param {URL} url - 현재 페이지 URL
 * @returns {Promise<object>} parent 데이터 또는 리디렉트
 */
export async function requireAuth(parent, url) {
	const parentData = await parent();
	const { user } = parentData;

	// 사용자가 로그인되지 않은 경우
	if (!user) {
		// 현재 경로를 redirectTo 파라미터로 전달
		const redirectTo = encodeURIComponent(url.pathname + url.search);
		throw redirect(302, `/auth/sign-in?redirectTo=${redirectTo}`);
	}

	return parentData;
}

/**
 * 특정 페이지들을 인증 검사에서 제외해야 하는지 확인
 * 
 * @param {string} pathname - 현재 경로
 * @returns {boolean} 인증 검사를 제외할지 여부
 */
export function shouldSkipAuth(pathname) {
	const publicPaths = [
		'/auth/sign-in',
		'/auth/sign-up',
		'/auth/sign-out',
		'/' // 루트 페이지
	];
	
	return publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
}