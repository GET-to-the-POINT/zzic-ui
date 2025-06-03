/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const { todoId } = params;
	
	// 더미 데이터
	const dummyTodos = [
		{
			id: 1,
			title: '프로젝트 기획서 작성',
			description: '새로운 웹 애플리케이션을 위한 상세한 기획서를 작성해야 합니다. 사용자 요구사항 분석, 기능 명세, UI/UX 디자인 가이드라인 등을 포함해야 합니다.',
			done: false
		},
		{
			id: 2,
			title: 'Svelte 5 학습',
			description: 'Svelte 5의 새로운 runes 시스템과 변경된 문법들을 학습합니다. $props, $derived, $effect 등의 새로운 기능들을 익혀야 합니다.',
			done: true
		},
		{
			id: 3,
			title: '데이터베이스 설계',
			description: 'PostgreSQL을 사용한 데이터베이스 스키마 설계를 진행합니다. 사용자, 할일, 카테고리 테이블의 관계를 정의하고 인덱스를 최적화해야 합니다.',
			done: false
		},
		{
			id: 4,
			title: 'API 문서 작성',
			description: 'RESTful API 엔드포인트들에 대한 상세한 문서를 작성합니다. 요청/응답 스키마, 에러 코드, 인증 방식 등을 포함해야 합니다.',
			done: true
		},
		{
			id: 5,
			title: '테스트 코드 작성',
			description: '주요 기능들에 대한 단위 테스트와 통합 테스트를 작성합니다. Jest와 Playwright를 사용하여 테스트 환경을 구축해야 합니다.',
			done: false
		}
	];
	
	// todoId에 해당하는 todo 찾기
	const todo = dummyTodos.find(t => t.id === parseInt(todoId, 2));
	
	// todo가 없으면 404 에러
	if (!todo) {
		throw new Error(`Todo with id ${todoId} not found`);
	}
	
	return {
		todo
	};
}
