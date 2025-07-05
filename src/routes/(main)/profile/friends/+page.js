import { requireAuth } from '$lib/utils/auth-guard.js';

/** @type {import('./$types').PageLoad} */
export async function load({ parent, url }) {
	const { zzic, user } = await requireAuth(parent, url);

	// 친구 목록 가져오기
	const { data: friends, error: friendsError } = await zzic.friends.getList();

	// 받은 친구 요청 가져오기
	const { data: friendRequests, error: requestsError } = await zzic.friends.getReceivedRequests();

	// API 에러 발생 시 더미 데이터 사용
	if (friendsError) {
		console.warn('친구 목록 조회 실패:', friendsError);
	}
	if (requestsError) {
		console.warn('친구 요청 조회 실패:', requestsError);
	}

	return {
		meta: {
			title: '친구',
			description: '친구 목록을 관리하고 새로운 친구를 추가하세요'
		},
		user,
		friends: friends || [],
		friendRequests: friendRequests || []
	};
}
