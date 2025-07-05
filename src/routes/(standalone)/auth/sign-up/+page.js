/**
 * @type {import('./$types').PageLoad}
 */
export async function load() {
	return {
		meta: {
			title: '회원가입',
			description: '새 계정을 만들어 할 일 관리를 시작하세요.'
		}
	};
}
