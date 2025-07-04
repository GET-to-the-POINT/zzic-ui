/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	try {
		// 사용자 경험치 정보 가져오기
		const memberExperience = await locals.zzic.member.getExperience();
		
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