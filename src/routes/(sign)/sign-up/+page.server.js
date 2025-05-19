import { error, redirect } from '@sveltejs/kit';

export const prerender = false;

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const passwordConfirm = formData.get('passwordConfirm');
		const nickname = formData.get('nickname');

		const response = await fetch('https://zzic-api.xiyo.dev/sign-up', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password,
				passwordConfirm,
				nickname
			})
		});

		if (response.ok) {
			redirect(303, '/sign/done');
		}

		error(response.status, 'Failed to sign up');
	}
};
