import { sequence } from '@sveltejs/kit/hooks';
import { createZzicServerClient } from '$lib/zzic-api/zzic.js';
import { PUBLIC_ZZIC_API_URL } from '$env/static/public';

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
			credentials: 'include',
		});
		if (response.status === 307) {
			const setCookieHeader = response.headers.get('set-cookie');
			if (setCookieHeader) {
				try {
					/** @type {Array<{name: string, value: string, options: {path?: string, expires?: Date, maxAge?: number, httpOnly?: boolean, secure?: boolean, sameSite?: 'strict' | 'lax' | 'none'}} | null>} */
					const cookieEntries = setCookieHeader
						.split(/,(?=\s*[^;=\s]+=)/)
						.map(/** @param {string} cookie */ (cookie) => {
							const parts = cookie.trim().split(';').map(/** @param {string} p */ (p) => p.trim());
							const [name, value] = parts[0].split('=');
							if (!name || !value) return null;
							/** @type {any} */
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
										options.maxAge = parseInt(optVal); 
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
								}
							}
							return { name: name.trim(), value: value.trim(), options };
						})
						.filter(Boolean);
					cookieEntries.forEach(/** @param {any} cookieEntry */ (cookieEntry) => {
						if (cookieEntry) {
							/** @type {any} */
							let cookieOptions = {
								path: cookieEntry.options.path || '/',
								httpOnly: cookieEntry.options.httpOnly || false,
								secure: cookieEntry.options.secure || false,
							};
							const sameSite = cookieEntry.options.sameSite;
							if (sameSite === 'strict' || sameSite === 'lax' || sameSite === 'none') {
								/** @type {any} */ (cookieOptions).sameSite = sameSite;
							}
							event.cookies.set(cookieEntry.name, cookieEntry.value, cookieOptions);
						}
					});
				} catch (cookieError) {
					console.warn('307 응답에서 쿠키 파싱 실패:', cookieError);
				}
			}
		}
	}

	event.locals.zzic = createZzicServerClient(PUBLIC_ZZIC_API_URL, {
		global: {
			fetch: event.fetch
		},
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * 쿠키 배열을 설정하는 함수
			 * @param {Array<{name: string, value: string, options: {path?: string, expires?: Date, maxAge?: number, httpOnly?: boolean, secure?: boolean, sameSite?: 'strict' | 'lax' | 'none'}}>} cookiesToSet - 설정할 쿠키 배열
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(/** @param {{ name: string; value: string; options: {path?: string, expires?: Date, maxAge?: number, httpOnly?: boolean, secure?: boolean, sameSite?: 'strict' | 'lax' | 'none'}; }} cookieItem */ ({ name, value, options }) => {
					try {
						event.cookies.set(name, value, { ...options, path: options.path || '/' });
					} catch (error) {
						console.warn('쿠키 설정 실패:', error);
						// 응답이 이미 생성된 후에는 쿠키 설정이 불가능함
					}
				});
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

	/**
	 * 현재 사용자 정보만 가져오기
	 * @returns {Promise<object|null>} 사용자 정보 객체 또는 null
	 */
	event.locals.user = async () => {
		try {
			const {
				data: { user },
				error
			} = await event.locals.zzic.auth.getUser();

			if (error) {
				return null;
			}

			return user;
		} catch (error) {
			console.error('사용자 정보 가져오기 실패:', error);
			return null;
		}
	};

	return resolve(event);
};

export const handle = sequence(zzic);