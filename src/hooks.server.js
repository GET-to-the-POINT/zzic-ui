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
	// 자동 리디렉트를 막고 수동으로 처리
	const response = await fetch(request.url, { ...request, redirect: 'manual', credentials: 'include' });

	// 307 리디렉트 응답 처리
	if (response.status === 307) {
		const setCookieHeader = response.headers.get('set-cookie');
		
		if (setCookieHeader) {
			// Set-Cookie 헤더에서 쿠키를 파싱하고 event.cookies에 설정
			try {
				const cookieEntries = setCookieHeader
					.split(/,(?=\s*[^;=\s]+=)/) // 여러 쿠키 처리
					.map(cookie => {
						const parts = cookie.trim().split(';').map(p => p.trim());
						const [name, value] = parts[0].split('=');
						if (!name || !value) return null;

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
									// sameSite 값을 올바른 타입으로 변환
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

				// 파싱된 쿠키들을 event.cookies에 설정
				cookieEntries.forEach((cookieEntry) => {
					if (cookieEntry) {
						const options = {
							path: cookieEntry.options.path || '/',
							httpOnly: cookieEntry.options.httpOnly || false,
							secure: cookieEntry.options.secure || false,
						};
						
						if (cookieEntry.options.sameSite === 'strict' || 
							cookieEntry.options.sameSite === 'lax' || 
							cookieEntry.options.sameSite === 'none') {
							options.sameSite = cookieEntry.options.sameSite;
						}
						
						event.cookies.set(cookieEntry.name, cookieEntry.value, options);
					}
				});

				// 쿠키가 설정된 후 원래 요청을 다시 실행
				const retryResponse = await fetch(request);
				return retryResponse;
				
			} catch (cookieError) {
				console.warn('307 응답에서 쿠키 파싱 실패:', cookieError);
			}
		}
	}

	return response;
}