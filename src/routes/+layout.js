import '$lib/app.css';
import { browser } from '$app/environment';
import { createZzicBrowserClient, createZzicServerClient } from '$lib/zzic-api/zzic.js';
import { PUBLIC_ZZIC_API_URL } from '$env/static/public';

/** @type {import('./$types').LayoutLoad} */
export const load = async ({ data, depends, fetch, url }) => {
	depends('zzic:auth');

    const referer = data.referer || (browser && navigation?.entries()[navigation.currentEntry?.index - 1]?.url);
	console.log('browser referer:', referer);

	const zzic = browser
		? createZzicBrowserClient(PUBLIC_ZZIC_API_URL, { global: { fetch } })
		: createZzicServerClient(PUBLIC_ZZIC_API_URL, {
				global: { fetch },
				cookies: {
					getAll: () => data.cookies
				}
			});

	const {
		data: { user }
	} = await zzic.auth.getUser();

	return { 
		zzic, 
		user, 
		referer,
		temporal: data.temporal
	};
};
