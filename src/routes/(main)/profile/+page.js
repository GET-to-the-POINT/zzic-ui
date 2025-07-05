import { requireAuth } from '$lib/utils/auth-guard.js';

/** @type {import('./$types').PageLoad} */
export async function load({ parent, url }) {
	const { zzic, user } = await requireAuth(parent, url);

	// menu/+page.js와 동일한 패턴으로 멤버 경험치 정보 가져오기
	const { data: memberExperience, error: experienceError } = await zzic.member.getMemberExperience({
		memberId: user.sub
	});

	// member API를 사용하여 회원 상세 정보 가져오기
	const { data: memberDetails, error: memberError } = await zzic.member.getMember(user.sub);

	// API 에러 발생 시 더미 데이터 사용
	if (experienceError) {
		console.warn('회원 경험치 정보 조회 실패:', experienceError);
	}
	if (memberError) {
		console.warn('회원 상세 정보 조회 실패:', memberError);
	}

	return {
		meta: {
			title: '프로필',
			description: '내 프로필 정보와 활동 통계를 확인하세요'
		},
		user, // 현재 사용자 정보
		memberExperience, // 회원 경험치 정보 (레벨, 경험치 등)
		memberDetails // 회원 상세 정보 (닉네임, 소개글 등)
	};
}
