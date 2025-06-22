import { sequence } from '@sveltejs/kit/hooks';
import { createZzicServerClient } from '$lib/zzic-api/zzicServer.js';
import { PUBLIC_ZZIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import { getUserFromCookies } from '$lib/jwt';

/**
 * 인증 가드 훅 - 로그인이 필요한 페이지 접근 제어
 * @type {import('@sveltejs/kit').Handle}
 */
const handleAuth = async ({ event, resolve }) => {
	// 토큰 갱신 로직
	const accessToken = event.cookies.get('access-token');
	const refreshToken = event.cookies.get('refresh-token');

	if (!accessToken && refreshToken) {
		await event.fetch(`${PUBLIC_ZZIC_API_URL}/auth/refresh`);
		event.locals.user = getUserFromCookies(event.cookies);
	} else if (accessToken && refreshToken) {
		event.locals.user = getUserFromCookies(event.cookies);
	}

	return resolve(event);
};

/**
 * 인증 가드 훅 - 로그인이 필요한 페이지 접근 제어
 * @type {import('@sveltejs/kit').Handle}
 */
const authGuard = async ({ event, resolve }) => {
	const guardPaths = ['/dashboard', '/settings', '/profile', '/todos'];
	const { pathname } = event.url;
	const isAuthRequired = guardPaths.some((path) => pathname.startsWith(path));

	if (!event.locals.user && isAuthRequired) {
		redirect(303, '/auth/sign-in');
	}

	return resolve(event);
};

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
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach((cookie) => {
					event.cookies.set(cookie.name, cookie.value, cookie.options || {});
				});
			}
		}
	});

	return resolve(event);
};

export const handle = sequence(handleAuth, authGuard, zzic);

/**
 * 페치 핸들러 - 307 리다이렉트 시 토큰 헤더를 유지하며 재요청, 응답 쿠키를 클라이언트에 전달
 * @type {import('@sveltejs/kit').HandleFetch}
 */
export const handleFetch = async ({ event, request, fetch }) => {
	const newRequest = new Request(request, {
		redirect: 'manual'
	});

	let response = await fetch(newRequest);

	const setCookieHeaders = response.headers.getSetCookie();

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
					options.sameSite = /** @type {'strict' | 'lax' | 'none'} */ (
						part.trim().split('=')[1].toLowerCase()
					);
				}
			});

			event.cookies.set(cookieName, value?.trim() || '', options);
		}
	});

	return response;
};
