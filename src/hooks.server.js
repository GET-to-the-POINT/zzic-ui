import { sequence } from '@sveltejs/kit/hooks';
import { createZzicServerClient } from '$lib/zzic-api/zzicServer.js';
import { PUBLIC_ZZIC_API_URL } from '$env/static/public';
import { ResponseCookieManager } from '$lib/utils/cookies.js';

/**
 * ZZIC 인증 훅
 * @type {import('@sveltejs/kit').Handle}
 */
const zzic = async ({ event, resolve }) => {

	const accessToken = event.cookies.get('access-token');
	const refreshToken = event.cookies.get('refresh-token');

	if (!accessToken && refreshToken) {
		const response = await event.fetch(`${PUBLIC_ZZIC_API_URL}/auth/refresh`, {
			redirect: 'manual',
		});
		// 새로운 ResponseCookieManager를 사용하여 간편하게 쿠키 처리
		const cookieManager = new ResponseCookieManager(event.cookies);
		cookieManager.applyFromResponse(response);
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

	const {
		data: { user }
	} = await event.locals.zzic.auth.getUser();
	event.locals.user = user;

	return resolve(event);
};

export const handle = sequence(zzic);
