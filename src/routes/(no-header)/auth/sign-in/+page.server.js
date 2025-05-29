import { redirect, fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic } }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const { error } = await zzic.auth.signIn({email, password});

		if (error) {
			const failure = Object.create(null);
			failure.message = error.message;
			return fail(400, { failure });
		}

		redirect(303, '/');
	}
};