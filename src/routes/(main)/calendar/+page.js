import { error } from '@sveltejs/kit';
import { validateAndPrepareOptions } from '$lib/schemas/todo-query.js';

/**
 * @typedef {Object} LoadParams
 * @property {Function} parent - 부모 레이아웃 데이터 로더
 * @property {Object} url - URL 객체
 * @property {URLSearchParams} url.searchParams - URL 검색 파라미터
 */

/**
 * @typedef {Object} PageData
 * @property {import('$lib/zzic-api/todo.js').PageTodoResponse} todoPage - todo 페이지 데이터
 * @property {import('$lib/zzic-api/category.js').PageCategoryResponse} categoryPage - 카테고리 페이지 데이터
 * @property {import('$lib/zzic-api/todo.js').TodoStatisticsResponse} todoStatisticsResponse - 할 일 통계 데이터
 * @property {Object} priorityResponse - 우선순위 데이터
 * @property {Object} tagPage - 태그 페이지 데이터
 */

/**
 * 캘린더 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} 캘린더 페이지 데이터
 */
export async function load({ parent, url }) {
	const { zzic } = await parent();

	// URL 쿼리 파라미터를 검증하고 객체로 변환
	const result = validateAndPrepareOptions(url.searchParams, {
		size: 100 // 캘린더용으로 많은 데이터 가져오기
	});

	if (!result.success) {
		error(400, { message: result.error.issues[0]?.message || '잘못된 파라미터입니다.' });
	}

	const [todosResult, categoriesResult, todoStatisticsResult, priorityResult, tagResult] =
		await Promise.all([
			zzic.todo.getTodos(result.searchParams),
			zzic.category.getCategories(),
			zzic.todo.getTodoStatistics(),
			zzic.priority.getPriorities(),
			zzic.tag.getTags({ size: 100 })
		]);

	if (todosResult.error) error(todosResult.error.message);

	return {
		todoPage: todosResult.data,
		categoryPage: categoriesResult.data,
		todoStatisticsResponse: todoStatisticsResult.data,
		priorityResponse: priorityResult.data,
		tagPage: tagResult.data
	};
}
