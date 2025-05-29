import { sequence } from '@sveltejs/kit/hooks';
import { createZzicServerClient } from '$lib/zzic.js';
import { PUBLIC_ZZIC_API_URL } from '$env/static/public';

const zzic = async ({ event, resolve }) => {

	event.locals.zzic = createZzicServerClient(PUBLIC_ZZIC_API_URL, {
		global: {
			fetch: event.fetch
		},
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options });
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

export const handleFetch = async ({ event, fetch, request }) => {
	const overridden = new Request(request, {
  redirect: 'manual',
  credentials: 'include'
});
    const response = await fetch(overridden);

	if (response.status !== 307) return response;

		const setCookieHeader = response.headers.get('set-cookie');
		if (setCookieHeader) {
			try {
				const cookieEntries = setCookieHeader
					.split(/,(?=\s*[^;=\s]+=)/)
					.map(cookie => {
						const parts = cookie.trim().split(';').map(p => p.trim());
						const [name, value] = parts[0].split('=');
						if (!name || !value) return null;
						const options = {};
						for (let i = 1; i < parts.length; i++) {
							const [optKey, optVal] = parts[i].split('=');
							const key = optKey.toLowerCase();
							switch (key) {
								case 'path': options.path = optVal; break;
								case 'expires': options.expires = new Date(optVal); break;
								case 'max-age': options.maxAge = parseInt(optVal); break;
								case 'secure': options.secure = true; break;
								case 'httponly': options.httpOnly = true; break;
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
				cookieEntries.forEach((cookieEntry) => {
					if (cookieEntry) {
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
				// 재요청은 retryResponse로 변수명 분리
				return fetch(overridden);
			} catch (cookieError) {
				console.warn('307 응답에서 쿠키 파싱 실패:', cookieError);
			}
		}
}