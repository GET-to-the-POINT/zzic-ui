import { error, redirect } from '@sveltejs/kit';

export const prerender = false;

export const actions = {
	default: async ({ request, fetch }) => {
		const response = await fetch('https://zzic-api.xiyo.dev/auth/sign-out', {
			method: 'POST',
		});

		cookies.delete('accessToken', { path: '/' });
		cookies.delete('refreshToken', { path: '/' });

		if (response.ok) {
			redirect(303, '/');
		}
		error(response.status, 'Failed to sign up');
	}
};
