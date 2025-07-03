import { error } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent }) {
	const { user, settings, zzic } = await parent();

	const { data: memberExperience, error: memberError } = await zzic.member.getMemberExperience({ memberId: user.sub });

	if (memberError) {
		error(memberError.status, memberError.message);
	}
	
	return {
		meta: {
			title: '메뉴',
			description: '앱의 모든 기능과 설정에 접근할 수 있는 메뉴 페이지입니다.'
		},
		user,
		settings,
		memberExperience
	};
}