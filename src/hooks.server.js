import { sequence } from '@sveltejs/kit/hooks';
import { createZzicServerClient } from '$lib/zzic-api/zzicServer.js';
import { PUBLIC_ZZIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

/**
 * ZZIC 인증 훅
 * @type {import('@sveltejs/kit').Handle}
 */
const zzic = async ({ event, resolve }) => {
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
				cookiesToSet.forEach((cookie) => {
					event.cookies.set(cookie.name, cookie.value, cookie.options);
				});
			}
		}
	});

	const {
		data: { user }
	} = await event.locals.zzic.auth.getUser();
	event.locals.user = user;

	return resolve(event);
};

const tokenRefresh = async ({ event, resolve }) => {
	// 토큰 갱신 로직
	const accessToken = event.cookies.get('access-token');
	const refreshToken = event.cookies.get('refresh-token');

	if (!accessToken && refreshToken) {
		await event.fetch(`${PUBLIC_ZZIC_API_URL}/auth/refresh`);
	}

	return resolve(event);
}

/**
 * 인증 가드 훅 - 로그인이 필요한 페이지 접근 제어
 * @type {import('@sveltejs/kit').Handle}
 */
const authGuard = async ({ event, resolve }) => {
	if (!event.locals.user && event.url.pathname.startsWith('/members')) {
		redirect(303, '/auth/sign-in');
	}

	if (event.locals.user && event.url.pathname === '/auth') {
		redirect(303, '/members');
	}

	return resolve(event);
};

export const handle = sequence(tokenRefresh, zzic, authGuard);

/**
 * 페치 핸들러 - 307 리다이렉트 시 토큰 헤더를 유지하며 재요청, 응답 쿠키를 클라이언트에 전달
 * @type {import('@sveltejs/kit').HandleFetch}
 */
export const handleFetch = async ({ event, request, fetch }) => {
	const newRequest = new Request(request, {
		redirect: 'manual'
	});

	let response = await fetch(newRequest);
	let setCookieHeaders;

	if (response.status === 307) {
		const redirectUrl = response.headers.get('location');

		if (redirectUrl) {
			// 307 응답의 쿠키를 다음 요청에 포함
			const authorization = response.headers.get('Authorization');
			const authorizationRefresh = response.headers.get('Authorization-refresh');
			setCookieHeaders = response.headers.getSetCookie();

			const redirectRequest = new Request(`${PUBLIC_ZZIC_API_URL}${redirectUrl}`, {
				method: request.method,
				headers: {
					...request.headers,
					'Authorization': authorization || '',
					'Authorization-refresh': authorizationRefresh
				},
				body: request.body
			});

			response = await fetch(redirectRequest);
		}
	}

	// Retrieve all 'set-cookie' headers without splitting on commas
	setCookieHeaders = setCookieHeaders ?? response.headers.getSetCookie();

	setCookieHeaders.forEach((singleCookieHeader) => {
		const cookieParts = singleCookieHeader.split(';');
		const [name, value] = cookieParts[0].split('=');
		const cookieName = name?.trim();

		if (cookieName === 'access-token' || cookieName === 'refresh-token') {
			// 쿠키 옵션들 파싱
			const options = { httpOnly: false, secure: false };

			cookieParts.slice(1).forEach((part) => {
				const trimmedPart = part.trim().toLowerCase();

				if (trimmedPart.startsWith('path=')) {
					options.path = part.trim().split('=')[1];
				} else if (trimmedPart.startsWith('domain=')) {
					options.domain = part.trim().split('=')[1];
				} else if (trimmedPart.startsWith('max-age=')) {
					options.maxAge = parseInt(part.trim().split('=')[1]);
				} else if (trimmedPart.startsWith('expires=')) {
					const expires = part.trim().split('=')[1];
					options.expires = new Date(expires);
				} else if (trimmedPart === 'httponly') {
					options.httpOnly = true;
				} else if (trimmedPart === 'secure') {
					options.secure = true;
				} else if (trimmedPart.startsWith('samesite=')) {
					options.sameSite = part.trim().split('=')[1].toLowerCase();
				}
			});

			event.cookies.set(cookieName, value?.trim() || '', options);
		}
	});

	return response;
};
