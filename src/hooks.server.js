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
