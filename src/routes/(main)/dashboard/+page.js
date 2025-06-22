import { error } from '@sveltejs/kit';

/**
 * @typedef {Object} LoadParams
 * @property {Function} parent - 부모 레이아웃 데이터 로더
 */

/**
 * @typedef {Object} PageData
 * @property {import('$lib/zzic-api/todo.js').PageTodoResponse} todoPage - todo 페이지 데이터
 * @property {import('$lib/zzic-api/todo.js').TodoStatisticsResponse} todoStatisticsResponse - 할 일 통계 데이터
 */

/**
 * 대시보드 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} 대시보드 페이지 데이터
 */
export async function load({ parent }) {
	const { zzic } = await parent();

	const [todoStatisticsResult, todosResult] = await Promise.all([
		zzic.todo.getTodoStatistics(),
		zzic.todo.getTodos({ size: 20 }) // 대시보드용으로 적당한 수량만 가져오기
	]);

	if (todoStatisticsResult.error) error(todoStatisticsResult.error.message);
	if (todosResult.error) error(todosResult.error.message);

	return {
		todoStatisticsResponse: todoStatisticsResult.data,
		todoPage: todosResult.data
	};
}
