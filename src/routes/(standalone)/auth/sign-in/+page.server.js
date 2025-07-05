import { redirect, fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const redirectTo = url.searchParams.get('redirectTo');

		const { error } = await zzic.auth.signIn({ email, password });

		if (error) {
			fail(400, {
				message: error
			});
		}

		if (redirectTo) {
			redirect(303, redirectTo);
		}

		return;
	}
};
