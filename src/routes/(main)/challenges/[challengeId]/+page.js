import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

// 참여/탈퇴 폼 스키마 정의
const participationSchema = z.object({
	action: z.enum(['join', 'leave'])
});

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const { challengeId } = params;
	const { zzic } = await parent();

	// @ts-ignore - zzic.challenge client is available from parent layout
	const { data: challenge, error } = await zzic.challenge.getChallenge(parseInt(challengeId));

	if (error || !challenge) {
		throw new Error(`Challenge with id ${challengeId} not found`);
	}

	// superForm을 위한 폼 데이터 생성
	const participationForm = await superValidate({}, zod(participationSchema));

	return {
		challenge,
		participationForm,
		title: challenge.title,
	};
}
