import { dev } from '$app/environment';
import { sequence } from '@sveltejs/kit/hooks';
import { parseJwtPayload } from '$lib/jwt.js';

// 사용자 정보 주입 핸들러
/** @type {import('@sveltejs/kit').Handle} */
export async function user({ event, resolve }) {
	const token = event.cookies.get('Authorization');

	if (token) {
		const user = parseJwtPayload(token);
		if (user) {
			event.locals.user = user;
		}
	}

	return resolve(event);
}

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch, event }) {
	const res = await fetch(request);
	const setCookie = res.headers.get('set-cookie');
	if (setCookie) {
		let forwarded = setCookie;
		if (dev) {
			const parts = setCookie.split(';').map((part) => part.trim());
			const filtered = parts.filter(
				p => !/^secure$/i.test(p) && !/^domain=/i.test(p)
			);
			forwarded = filtered.join('; ');
		}
		event.locals.forwardedCookie = forwarded;
	}
	return res;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function cookieForwarder({ event, resolve }) {
	const response = await resolve(event);

	if (event.locals.forwardedCookie) {
		response.headers.append('set-cookie', event.locals.forwardedCookie);
	}

	return response;
}

// sequence로 합성
export const handle = sequence(user, cookieForwarder);
