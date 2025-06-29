/**
 * @type {import('./$types').PageLoad}
 */
export async function load() {
	return {
		meta: {
			title: '로그아웃',
			description: '계정에서 안전하게 로그아웃합니다.'
		}
	};
}