/**
 * @type {import('./$types').PageLoad}
 */
export async function load() {
	return {
		meta: {
			title: '로그인',
			description: '계정에 로그인하여 할 일 관리를 시작하세요.'
		}
	};
}