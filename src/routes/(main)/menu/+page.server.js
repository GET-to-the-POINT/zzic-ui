/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	try {
		// 사용자 경험치 정보 가져오기
		// JWT payload에서 사용자 ID는 보통 sub 필드에 저장됨
		const memberId = locals.user.sub || locals.user.id || locals.user.memberId;

		if (!memberId) {
			console.error('User ID not found in JWT payload:', locals.user);
			return {
				user: locals.user,
				memberExperience: null
			};
		}

		const { data: memberExperience, error } = await locals.zzic.member.getMemberExperience({
			memberId
		});

		if (error) {
			console.error('Failed to load user experience:', error);
			return {
				user: locals.user,
				memberExperience: null
			};
		}

		return {
			user: locals.user,
			memberExperience
		};
	} catch (error) {
		console.error('Failed to load user experience:', error);
		// 에러가 발생해도 기본 사용자 정보는 반환
		return {
			user: locals.user,
			memberExperience: null
		};
	}
}
