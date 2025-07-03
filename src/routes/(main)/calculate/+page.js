import { requireAuth } from '$lib/utils/auth-guard.js';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url }) {
	await requireAuth(parent, url);
	return {
		meta: {
			title: '계산기',
			description: '간편한 계산기로 빠른 계산을 할 수 있습니다.'
		}
	};
}