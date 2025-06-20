import { error } from '@sveltejs/kit';
import { z } from 'zod';

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
 * @property {Object} priorityResponse - 우선순위 데이터
 * @property {Object} tagPage - 태그 페이지 데이터
 * @property {import('$lib/zzic-api/todo.js').PageTodoResponse} selectedDateTodos - 선택된 날짜의 todo 데이터 (심플뷰용)
 * @property {import('$lib/zzic-api/todo.js').PageTodoResponse} weeklyTodos - 일주일간의 todo 데이터 (심플뷰용)
 */

// URL 검색 파라미터 스키마 정의 (심플뷰용)
const searchParamsSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/, 'YYYY-MM-DDTHH:mm:ss±HH:MM 형식이어야 합니다 (타임존 정보 필수)')
		.refine((dateStr) => {
			const date = new Date(dateStr);
			return !isNaN(date.getTime());
		}, '유효하지 않은 날짜입니다')
		.transform((dateStr) => new Date(dateStr))
		.optional(),
	tab: z.enum(['full', 'simple']).optional().default('full')
});

/**
 * Todo 페이지 데이터를 로드합니다 (두 버전 모두 지원)
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} Todo 페이지 데이터
 */
export async function load({ parent, url }) {
	const { zzic } = await parent();

	// URL 쿼리 파라미터 파싱
	const parseResult = searchParamsSchema.safeParse(Object.fromEntries(url.searchParams));
	if (!parseResult.success) {
		error(400, { message: parseResult.error.issues[0]?.message || '잘못된 파라미터입니다.' });
	}

	const { date: selectedDate, tab } = parseResult.data;

	// 기본 옵션 (전체뷰용)
	const basicOptions = Object.fromEntries(url.searchParams);
	delete basicOptions.date; // 날짜 필터는 심플뷰에서만 사용
	delete basicOptions.tab;

	// 심플뷰용 옵션
	const currentDate = selectedDate || new Date();
	const startOfDay = new Date(currentDate);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(currentDate);
	endOfDay.setHours(23, 59, 59, 999);

	const simpleOptions = {
		dueDate: currentDate.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }) + 'T00:00:00+09:00',
		size: 20
	};

	// 일주일 범위 계산 (심플뷰 캐러셀용)
	const weekStart = new Date(currentDate);
	weekStart.setDate(currentDate.getDate() - 3);
	const weekEnd = new Date(currentDate);
	weekEnd.setDate(currentDate.getDate() + 3);
	
	const weeklyOptions = {
		dueDateStart: weekStart.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }) + 'T00:00:00+09:00',
		dueDateEnd: weekEnd.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }) + 'T23:59:59+09:00',
		size: 100
	};

	const [
		todosResult,
		categoriesResult,
		todoStatisticsResult,
		priorityResult,
		tagResult,
		selectedDateTodosResult,
		weeklyTodosResult
	] = await Promise.all([
		zzic.todo.getTodos(basicOptions),
		zzic.category.getCategories(),
		zzic.todo.getTodoStatistics(),
		zzic.priority.getPriorities(),
		zzic.tag.getTags({ size: 100 }),
		zzic.todo.getTodos(simpleOptions),
		zzic.todo.getTodos(weeklyOptions)
	]);

	if (todosResult.error) error(todosResult.error.message);

	return {
		todoPage: todosResult.data,
		categoryPage: categoriesResult.data,
		todoStatisticsResponse: todoStatisticsResult.data,
		priorityResponse: priorityResult.data,
		tagPage: tagResult.data,
		selectedDateTodos: selectedDateTodosResult.data || { content: [], totalElements: 0 },
		weeklyTodos: weeklyTodosResult.data || { content: [], totalElements: 0 },
		currentTab: tab || 'full'
	};
}
