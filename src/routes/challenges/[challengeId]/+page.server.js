import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { createChallengeClient } from '$lib/zzic-api/challenge.js';
import { joinChallengeSchema, joinChallengeDefaults } from '$lib/components/sections/challenge/joinChallengeSchema.js';
import { API_BASE_URL } from '$env/static/private';

/**
 * 페이지 로드 시 실행
 * @param {import('@sveltejs/kit').PageServerLoad} param0
 */
export async function load({ fetch, params }) {
	const challengeId = parseInt(params.challengeId);
	
	// 챌린지 상세 정보 조회
	const challengeClient = createChallengeClient(API_BASE_URL, fetch);
	const { data: challenge, error } = await challengeClient.getChallenge(challengeId);
	
	if (error) {
		throw error.status === 404 ? 
			new Error('챌린지를 찾을 수 없습니다.') : 
			new Error('챌린지 정보를 불러오는데 실패했습니다.');
	}
	
	// 참여 폼 초기화
	const joinForm = await superValidate(
		{ ...joinChallengeDefaults, challengeId }, 
		zod(joinChallengeSchema)
	);
	
	return {
		challenge,
		joinForm
	};
}

/**
 * 폼 액션들
 */
export const actions = {
	/**
	 * 챌린지 참여 액션
	 * @param {import('@sveltejs/kit').RequestEvent} requestEvent
	 */
	joinChallenge: async ({ request, fetch, params }) => {
		// 폼 데이터 검증
		const joinForm = await superValidate(request, zod(joinChallengeSchema));
		
		if (!joinForm.valid) {
			return fail(400, { joinForm });
		}
		
		const challengeId = parseInt(params.challengeId);
		
		// 챌린지 참여 API 호출
		const challengeClient = createChallengeClient(API_BASE_URL, fetch);
		const { error } = await challengeClient.joinChallenge(challengeId);
		
		if (error) {
			// API 에러 처리
			if (error.status === 400) {
				return fail(400, { 
					joinForm,
					message: '이미 참여 중인 챌린지입니다.' 
				});
			} else if (error.status === 401) {
				return fail(401, { 
					joinForm,
					message: '로그인이 필요합니다.' 
				});
			} else if (error.status === 404) {
				return fail(404, { 
					joinForm,
					message: '챌린지를 찾을 수 없습니다.' 
				});
			} else {
				return fail(500, { 
					joinForm,
					message: '챌린지 참여에 실패했습니다. 잠시 후 다시 시도해주세요.' 
				});
			}
		}
		
		// 성공 시 챌린지 페이지로 리다이렉트
		throw redirect(302, `/challenges/${challengeId}?joined=true`);
	},
	
	/**
	 * 챌린지 탈퇴 액션
	 * @param {import('@sveltejs/kit').RequestEvent} requestEvent
	 */
	leaveChallenge: async ({ fetch, params }) => {
		const challengeId = parseInt(params.challengeId);
		
		// 챌린지 탈퇴 API 호출
		const challengeClient = createChallengeClient(API_BASE_URL, fetch);
		const { error } = await challengeClient.leaveChallenge(challengeId);
		
		if (error) {
			// API 에러 처리
			if (error.status === 400) {
				return fail(400, { message: '참여하지 않은 챌린지입니다.' });
			} else if (error.status === 401) {
				return fail(401, { message: '로그인이 필요합니다.' });
			} else if (error.status === 404) {
				return fail(404, { message: '챌린지를 찾을 수 없습니다.' });
			} else {
				return fail(500, { message: '챌린지 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.' });
			}
		}
		
		// 성공 시 챌린지 페이지로 리다이렉트
		throw redirect(302, `/challenges/${challengeId}?left=true`);
	}
};
