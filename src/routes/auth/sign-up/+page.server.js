import { fail, redirect } from '@sveltejs/kit';

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

		if (!response.ok) {
			const errorResponse = await response.json().catch(() => null) || {};
			// Map errors array to a field->message object
			const fieldErrors = {};
			if (Array.isArray(errorResponse.errors)) {
				for (const e of errorResponse.errors) {
					fieldErrors[e.field] = e.defaultMessage;
				}
			}
			return fail(errorResponse.status || response.status, {
				errors: fieldErrors,
				message: errorResponse.message || '회원가입에 실패했습니다.'
			});
		}

		return redirect(303, '/auth/sign/done');
	}
};