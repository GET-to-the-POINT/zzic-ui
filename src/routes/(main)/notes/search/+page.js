import { requireAuth } from '$lib/utils/auth-guard.js';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url }) {
	await requireAuth(parent, url);

	const searchQuery = url.searchParams.get('q') || '';

	return {
		meta: {
			title: '노트 검색',
			description: '노트를 검색합니다.'
		},
		searchQuery
	};
}
