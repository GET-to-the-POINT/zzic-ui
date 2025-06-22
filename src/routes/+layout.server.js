import { getSettingsFromCookies } from '$lib/utils/settings.js';

export async function load({ cookies }) {
	const settings = getSettingsFromCookies(cookies);

	return {
		cookies: cookies.getAll(),
		settings
	};
}
