/**
 * @typedef {Object} Todo
 * @property {string} id - Todo ID
 * @property {string} title - Todo 제목
 * @property {string} [description] - Todo 설명
 * @property {boolean} done - 완료 여부
 * @property {string} createdAt - 생성 시간
 * @property {string} [updatedAt] - 수정 시간
 */

/**
 * @typedef {Object} TodoPage
 * @property {Array<Todo>} content - Todo 목록
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {number} number - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 */

/**
 * @typedef {Object} LoadParams
 * @property {Function} parent - 부모 레이아웃 데이터 로더
 * @property {Object} params - 라우트 파라미터
 * @property {string} params.nickname - 사용자 닉네임
 * @property {Object} url - URL 객체
 * @property {URLSearchParams} url.searchParams - URL 검색 파라미터
 */

/**
 * @typedef {Object} PageData
 * @property {Array<Todo>} yetTodos - 미완료 todo 목록
 * @property {Array<Todo>} doneTodos - 완료된 todo 목록
 * @property {TodoPage} yetTodoPage - 미완료 todo 페이지 데이터
 * @property {TodoPage} doneTodoPage - 완료된 todo 페이지 데이터
 */

/**
 * Todo 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} Todo 페이지 데이터
 */
export async function load({ parent }) {
	const { zzic, user } = await parent();

	try {
		const yetTodoPromise = zzic.todo.getTodos(user.sub, { done: false });
		const doneTodoPromise = zzic.todo.getTodos(user.sub, { done: true });

		const results = await Promise.all([yetTodoPromise, doneTodoPromise]);		

		const [{ data: yetTodoPage }, { data: doneTodoPage }] = results;

		// 배열로 추출하여 반환
		const yetTodos = yetTodoPage?.content || [];
		const doneTodos = doneTodoPage?.content || [];

		return {
			yetTodos,
			doneTodos,
			yetTodoPage,
			doneTodoPage
		};
	} catch (error) {
		console.error('Error loading todos:', error);
		return {
			yetTodos: [],
			doneTodos: [],
			yetTodoPage: { content: [], totalElements: 0 },
			doneTodoPage: { content: [], totalElements: 0 }
		};
	}
}
