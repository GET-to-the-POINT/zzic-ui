import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');
		const nickname = formData.get('nickname');

		const { error } = await zzic.auth.signUp({ email, password, confirmPassword, nickname });
		if (error) {
			fail(error.status, {
				failure: error
			});
		}

		redirect(303, '/');
	}
};
