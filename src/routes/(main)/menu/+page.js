import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/utils/auth-guard.js';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url }) {
	const { user, settings, zzic } = await requireAuth(parent, url);

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