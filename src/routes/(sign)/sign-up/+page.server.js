import { error, redirect } from '@sveltejs/kit';

export const prerender = false;

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');
		const nickName = formData.get('nickName');

		const response = await fetch('https://zzic-api.xiyo.dev/auth/sign-up', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password,
				confirmPassword,
				nickName
			})
		});

		if (response.ok) {
			redirect(303, '/sign/done');
		}

		const text = await response.text();

		error(response.status, 'Failed to sign up');
	}
};