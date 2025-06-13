import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const { challengeId } = params;
	const { zzic } = await parent();

	const { data: challenge, error: challengeError } = await zzic.challenge.getChallenge(challengeId);

	if (challengeError) {
		error(404, {
			message: challengeError.message
		});
	}

	return {
		challenge,
		title: "챌린지 상세 보기",
	};
}
