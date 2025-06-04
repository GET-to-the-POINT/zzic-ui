/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const { todoId } = params;

	// 더미 데이터
	const todo = {
		id: 1,
		title: '프로젝트 기획서 작성',
		description:
			'새로운 웹 애플리케이션을 위한 상세한 기획서를 작성해야 합니다. 사용자 요구사항 분석, 기능 명세, UI/UX 디자인 가이드라인 등을 포함해야 합니다.',
		done: false
	};

	// todo가 없으면 404 에러
	if (!todo) {
		throw new Error(`Todo with id ${todoId} not found`);
	}

	return {
		todo
	};
}
