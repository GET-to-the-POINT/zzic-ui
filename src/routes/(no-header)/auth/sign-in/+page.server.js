import { redirect, fail } from '@sveltejs/kit';


export const prerender = false;

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const response = await fetch('https://zzic-api.xiyo.dev/auth/sign-in', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const notOk = await response.json();
			return fail(response.status, {
				...notOk
			});
		}

		redirect(303, '/');
	}
};