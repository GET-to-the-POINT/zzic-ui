import { error, redirect } from '@sveltejs/kit';

export const prerender = false;

export const actions = {
	default: async ({ fetch, cookies }) => {
		const response = await fetch('https://zzic-api.xiyo.dev/auth/sign-out', {
			method: 'POST',
			credentials: 'include'
		});
		if (response.ok) {
			cookies.delete('zzic-cookie', { path: '/' });
			throw redirect(303, '/');
		}
		throw error(response.status, 'Failed to sign out');
	}
};