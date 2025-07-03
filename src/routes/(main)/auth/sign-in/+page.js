/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ url }) {
	// redirectTo 파라미터 처리
	const redirectTo = url.searchParams.get('redirectTo');
	
	return {
		meta: {
			title: '로그인',
			description: '계정에 로그인하여 할 일 관리를 시작하세요.'
		},
		redirectTo
	};
}