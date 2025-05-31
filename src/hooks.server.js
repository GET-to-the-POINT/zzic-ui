import { sequence } from '@sveltejs/kit/hooks';
import { createZzicServerClient } from '$lib/zzic-api/zzicServer.js';
import { PUBLIC_ZZIC_API_URL } from '$env/static/public';
import { ResponseCookieManager } from '$lib/utils/cookies.js';

/**
 * ZZIC 인증 훅
 * @type {import('@sveltejs/kit').Handle}
 */
const zzic = async ({ event, resolve }) => {

	const accessToken = event.cookies.get('Authorization');
	const refreshToken = event.cookies.get('Authorization-refresh');

	if (!accessToken && refreshToken) {
		const response = await event.fetch(`${PUBLIC_ZZIC_API_URL}/auth/refresh`, {
			redirect: 'manual',
		});
		if (response.status === 307) {
			// 새로운 ResponseCookieManager를 사용하여 간편하게 쿠키 처리
			const cookieManager = new ResponseCookieManager(event.cookies);
			cookieManager.applyFromResponse(response);
		}
	}

	event.locals.zzic = createZzicServerClient(PUBLIC_ZZIC_API_URL, {
		global: {
			fetch: event.fetch
		},
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * 쿠키 배열을 설정하는 함수 - ResponseCookieManager 사용
			 * @param {Array<{name: string, value: string, options: {path?: string, expires?: Date, maxAge?: number, httpOnly?: boolean, secure?: boolean, sameSite?: 'strict' | 'lax' | 'none'}}>} cookiesToSet - 설정할 쿠키 배열
			 */
			setAll: (cookiesToSet) => {
				const cookieManager = new ResponseCookieManager(event.cookies);
				cookieManager.setAll(cookiesToSet);
			}
		}
	});

	// 익명 사용자 로그인을 resolve 전에 완료
	if (!accessToken && !refreshToken) {
		try {
			await event.locals.zzic.auth.signIn({email: "anonymous@shared.com"});
		} catch (error) {
			console.warn('익명 로그인 실패:', error);
			// 익명 로그인 실패해도 계속 진행
		}
	}

	return resolve(event);
};

export const handle = sequence(zzic);

export const handleFetch = async ({ event, request, fetch }) => {
	// const newRequest = new Request(request, {
	// 	credentials: 'include',
	// });

	return fetch(request);
}
