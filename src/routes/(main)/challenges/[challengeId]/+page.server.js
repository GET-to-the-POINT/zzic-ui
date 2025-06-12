import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

// 참여/탈퇴 폼 스키마 정의
const participationSchema = z.object({
	action: z.enum(['join', 'leave'])
});

/** @satisfies {import('./$types').Actions} */
export const actions = {
	join: async ({ request, locals: { zzic }, params, url }) => {
		const { challengeId } = params;
		const form = await superValidate(request, zod(participationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// @ts-ignore - zzic.challenge client is available from locals
		const { error } = await zzic.challenge.join(parseInt(challengeId));

		if (error) {
			console.error('Challenge participation error:', error);
			return fail(400, { 
				form, 
				error: error.message || '챌린지 참여에 실패했습니다.' 
			});
		}

		throw redirect(303, `${url.pathname}`);
	},

	leave: async ({ request, locals: { zzic, user }, params }) => {
		const { challengeId } = params;
		const form = await superValidate(request, zod(participationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// @ts-ignore - zzic.challenge client is available from locals
		const { error } = await zzic.challenge.withdrawFromChallenge(parseInt(challengeId));

		if (error) {
			console.error('Challenge withdrawal error:', error);
			return fail(400, { 
				form, 
				error: error.message || '챌린지 탈퇴에 실패했습니다.' 
			});
		}

		// 성공적으로 탈퇴한 후 페이지 새로고침
		throw redirect(303, `/challenges/${challengeId}?left=true`);
	}
};
