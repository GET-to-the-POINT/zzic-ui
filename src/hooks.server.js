import dev from '$app/environment';

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch, event }) {
	const res = await fetch(request);
	const setCookie = res.headers.get('set-cookie');
	if (setCookie) {
		if (dev) {
			event.locals.forwardedCookie = setCookie;
		} else {
			const parts = setCookie.split(';').map((part) => part.trim());
			const cookieValue = parts[0]; // first key=value
			const pathPart = parts.find((p) => p.toLowerCase().startsWith('path='));
			const attributes = [cookieValue];
			if (pathPart) attributes.push(pathPart);
			event.locals.forwardedCookie = attributes.join('; ');
		}
	}

	return res;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event);

	if (event.locals.forwardedCookie) {
		response.headers.append('set-cookie', event.locals.forwardedCookie);
	}

	return response;
}
