import { fail, redirect } from '@sveltejs/kit';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	enroll: async ({ request, locals: { zzic }, params, url }) => {
		const { challengeId } = params;

		const data = await request.formData();
		const redirectTo = /** @type {string} */ (data.get('redirect')) || url.pathname;
		const enrollParam = /** @type {string} */ (data.get('enroll'));
		const shouldEnroll = enrollParam === 'true';

		const { error } = await zzic.challenge.enroll({ challengeId }, { enroll: shouldEnroll });

		if (error) {
			fail(400, { 
				error: error.message
			});
		}

		redirect(303, redirectTo);
	}
};
