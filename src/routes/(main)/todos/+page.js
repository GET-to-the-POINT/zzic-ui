import { error } from '@sveltejs/kit';

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
 * @property {import('$lib/zzic-api/todo.js').PageTodoResponse} todoPage - todo 페이지 데이터
 * @property {import('$lib/zzic-api/category.js').PageCategoryResponse} categoryPage - 카테고리 페이지 데이터
 * @property {import('$lib/zzic-api/todo.js').TodoStatisticsResponse} todoStatisticsResponse - 할 일 통계 데이터
 */

/**
 * Todo 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} Todo 페이지 데이터
 */
export async function load({ parent }) {
	const { zzic } = await parent();

	const [todosResult, categoriesResult, TodoStatisticsResult] = await Promise.all([
		zzic.todo.getTodos(),
		zzic.category.getCategories(),
		zzic.todo.getTodoStatistics()
	]);

	if (todosResult.error) error(todosResult.error.message);

	return {
		todoPage: todosResult.data,
		categoryPage: categoriesResult.data,
		todoStatisticsResponse: TodoStatisticsResult.data
	};
}
