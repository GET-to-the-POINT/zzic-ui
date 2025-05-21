import { error, redirect } from '@sveltejs/kit';

export const prerender = false;

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const response = await fetch('https://zzic-api.xiyo.dev/auth/sign-in', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
			credentials: 'include'
		});

//		if (response.ok) {
			redirect(303, '/');
//		}
	}
};