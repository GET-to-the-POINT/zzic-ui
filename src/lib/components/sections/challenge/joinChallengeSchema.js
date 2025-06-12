import { z } from 'zod';

/**
 * 챌린지 참여 폼 검증 스키마
 * formsnap과 sveltekit-superforms에서 사용
 */
export const joinChallengeSchema = z.object({
	/**
	 * 참여할 챌린지 ID
	 */
	challengeId: z.number({
		required_error: '챌린지 ID가 필요합니다.'
	}).int().positive('유효한 챌린지 ID가 아닙니다.'),
	
	/**
	 * 챌린지 규칙 동의 여부
	 */
	agree: z.boolean({
		required_error: '동의 여부를 선택해주세요.'
	}).refine(val => val === true, {
		message: '챌린지 규칙에 동의해야 참여할 수 있습니다.'
	})
});

/**
 * 폼 초기값
 */
export const joinChallengeDefaults = {
	challengeId: 0,
	agree: false
};
