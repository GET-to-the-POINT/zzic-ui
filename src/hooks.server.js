import { dev } from '$app/environment';
import { sequence } from '@sveltejs/kit/hooks';
import { parseJwtPayload } from '$lib/jwt.js';

// 사용자 정보 주입 핸들러
/** @type {import('@sveltejs/kit').Handle} */
export async function user({ event, resolve }) {
	let token = event.cookies.get('Authorization');

	if (!token) {
		const res = await fetch('https://zzic-api.xiyo.dev/auth/sign-in', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: 'anonymous@shared.com' })
		});
		const setCookie = res.headers.get('set-cookie');
		event.locals.forwardedCookie = setCookie;
		const match = setCookie.match(/Authorization=([^;]+)/);
		token = match[1];
	}

	event.locals.user = parseJwtPayload(token);

	return resolve(event);
}

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch, event }) {
	const res = await fetch(request);
	const setCookie = res.headers.get('set-cookie');
	if (setCookie) {
		event.locals.forwardedCookie = setCookie;
	}
	return res;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function cookieForwarder({ event, resolve }) {
	const response = await resolve(event);

	if (event.locals.forwardedCookie) {
		let cookie = event.locals.forwardedCookie;
		if (!dev) {
			// In production, enforce Secure and SameSite attributes
			const parts = cookie.split(';').map((p) => p.trim());
			// Remove duplicate attributes if present
			const filtered = parts.filter((p) => !/^(Secure|SameSite)/i.test(p));
			cookie = [...filtered, 'Secure', 'SameSite=Strict'].join('; ');
		}
		response.headers.append('set-cookie', cookie);
	}

	return response;
}

// sequence로 합성
export const handle = sequence(user, cookieForwarder);
