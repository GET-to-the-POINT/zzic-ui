import { redirect, fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { zzic }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const redirectTo = url.searchParams.get('redirectTo') || formData.get('redirectTo');

		console.log('Form data received:', {
			email,
			password: password === '' ? '[empty string]' : `[${password?.length} chars]`,
			passwordType: typeof password
		});

		const { error } = await zzic.auth.signIn({ email, password });

		// 데모 계정 로그인 시도 로그
		if (email === 'anon@zzic.com') {
			console.log('Demo account login attempt:', {
				email,
				passwordLength: password?.length,
				error
			});
		}

		if (error) {
			return fail(400, {
				message: typeof error === 'string' ? error : '로그인에 실패했습니다.'
			});
		}

		if (redirectTo) {
			redirect(303, redirectTo);
		}

		redirect(303, '/dashboard');
	}
};
