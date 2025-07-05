import { requireAuth } from '$lib/utils/auth-guard.js';

/** @type {import('./$types').PageLoad} */
export async function load({ parent, url }) {
	const { zzic, user } = await requireAuth(parent, url);

	// TODO: 실제 API가 구현되면 아래 주석을 해제하고 더미 데이터 제거
	/*
	const [
		{ data: userProfile, error: profileError },
		{ data: userStats, error: statsError },
		{ data: userAchievements, error: achievementsError },
		{ data: userRanking, error: rankingError }
	] = await Promise.all([
		zzic.user.getProfile(),
		zzic.user.getStats(),
		zzic.user.getAchievements(),
		zzic.user.getRanking()
	]);

	if (profileError) error(500, String(profileError));
	if (statsError) error(500, String(statsError));
	if (achievementsError) error(500, String(achievementsError));
	if (rankingError) error(500, String(rankingError));
	*/

	return {
		meta: {
			title: '프로필',
			description: '내 프로필 정보와 활동 통계를 확인하세요'
		},
		user // 현재 사용자 정보는 이미 있음
		// userProfile,
		// userStats,
		// userAchievements,
		// userRanking
	};
}