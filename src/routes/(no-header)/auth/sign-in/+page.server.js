import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '../schema.js';

export const load = async () => {
	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions = {
	default: async ({ request, locals: { zzic } }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { email, password = "" } = form.data;
		const { error } = await zzic.auth.signIn({ email, password });

		if (error) {
			return fail(400, {
				form,
				message: error
			});
		}

		redirect(303, '/');
	}
};
