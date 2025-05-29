import { sequence } from '@sveltejs/kit/hooks';
import { createZzicServerClient } from '$lib/zzic-api/zzic.js';
import { PUBLIC_ZZIC_API_URL } from '$env/static/public';

/**
 * ZZIC 인증 훅
 * @param {{ event: import('@sveltejs/kit').RequestEvent; resolve: Function }} param0
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
					/** @type {Array<{name: string, value: string, options: any} | null>} */
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
			setAll: /** @param {Array<{name: string, value: string, options: any}>} cookiesToSet */ (cookiesToSet) => {
				cookiesToSet.forEach(/** @param {{ name: any; value: any; options: any; }} param0 */ ({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * 현재 사용자 정보만 가져오기
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