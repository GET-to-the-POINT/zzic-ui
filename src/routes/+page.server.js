import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.user) {
		redirect(302, '/dashboard');
	}

	// 인증되지 않은 사용자를 위한 데이터
	return {
		isAuthenticated: false,
		showLandingPage: true
	};
}
