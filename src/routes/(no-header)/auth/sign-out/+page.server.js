import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals: { zzic } }) => {
		await zzic.auth.signOut();
		throw redirect(303, '/');
	}
};
