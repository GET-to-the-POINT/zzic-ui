import { error, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals: { zzic } }) => {
		zzic.auth.signOut();
		throw redirect(303, '/');
	}
};
