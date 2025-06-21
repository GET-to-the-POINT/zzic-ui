import { error } from '@sveltejs/kit';

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
 * @property {Object} tagPage - 태그 페이지 데이터
 */

/**
 * Timer 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} Timer 페이지 데이터
 */
export async function load({ parent, url }) {
	const { zzic } = await parent();

	// URL 쿼리 파라미터를 옵션으로 변환
	const options = Object.fromEntries(url.searchParams);
	
	// 완료된 투두 숨기기 (statusId: 2)
	options.hideStatusIds = '2';
    options.size = 200;
	
	const [
		todosResult,
		categoriesResult,
		tagResult
	] = await Promise.all([
		zzic.todo.getTodos(options),
		zzic.category.getCategories(),
		zzic.tag.getTags(options)
	]);

	if (todosResult.error) {
		error(500, { message: todosResult.error.message });
	}

	return {
		todoPage: todosResult.data,
		categoryPage: categoriesResult.data,
		tagPage: tagResult.data
	};
}
