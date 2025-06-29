/**
 * @type {import('./$types').PageLoad}
 */
export async function load() {
	return {
		meta: {
			title: '노트',
			description: '마크다운을 지원하는 노트 작성 및 관리 페이지입니다.'
		}
	};
}