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
 * @property {import('$lib/zzic-api/todo.js').PageTodoResponse} selectedDateTodos - 선택된 날짜의 todo 데이터
 * @property {import('$lib/zzic-api/todo.js').PageTodoResponse} weeklyTodos - 일주일간의 todo 데이터 (캐러셀용)
 */

// URL 검색 파라미터 스키마 정의
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
	hideStatusIds: z
		.string()
		.transform((str) => str.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)))
		.optional()
});

/**
 * 날짜를 YYYY-MM-DDTHH:mm:ss+09:00 형식 문자열로 변환
 * @param {Date} date - 변환할 날짜
 * @param {string} time - 시간 부분 (기본값: '00:00:00')
 * @returns {string} ISO 8601 형식 문자열 (한국 시간대)
 */
function formatDateWithTimezone(date, time = '00:00:00') {
	const dateStr = date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
	return `${dateStr}T${time}+09:00`;
}

// TODO: [BACKEND] 향후 백엔드에서 날짜 캐러셀용 데이터를 직접 제공해야 합니다.
// 백엔드 API가 준비되면 다음과 같은 구조로 데이터를 받아야 합니다:
// {
//   selectedDateTodos: PageTodoResponse,
//   weeklyTodos: PageTodoResponse,
//   dateCarousel: Array<{
//     isoDate: string,        // YYYY-MM-DD 형식
//     empty: boolean,         // 해당 날짜에 todo가 없는지 여부
//     todoCount: number       // 해당 날짜의 todo 개수
//   }>
// }

/**
 * Todo 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} Todo 페이지 데이터
 */
export async function load({ parent, url }) {
	const { zzic } = await parent();

	// URL 검색 파라미터를 Zod로 파싱 및 검증
	const rawParams = Object.fromEntries(url.searchParams.entries());
	const parsedParams = searchParamsSchema.safeParse(rawParams);
	
	let targetDate;
	let hideStatusIds;
	
	if (parsedParams.success) {
		targetDate = parsedParams.data.date;
		hideStatusIds = parsedParams.data.hideStatusIds;
	} else {
		// 파싱 실패시 에러 발생
		const errorDetails = parsedParams.error.issues.map(issue => 
			`필드 '${issue.path.join('.')}': ${issue.message}`
		).join(', ');
		
		console.info('URL 파라미터 파싱 실패:', {
			rawParams,
			errors: parsedParams.error.format()
		});
		
		error(400, `잘못된 URL 파라미터입니다. ${errorDetails}`);
	}
	
	// targetDate가 없으면 오늘 날짜 사용
	if (!targetDate) {
		targetDate = new Date();
	}
	
	// 1. 선택된 날짜의 데이터 조회를 위한 옵션
	const targetDateStr = formatDateWithTimezone(targetDate, '00:00:00');
	const targetDateEndStr = formatDateWithTimezone(targetDate, '23:59:59');
	/** @type {any} */
	let selectedDateOptions = { 
		startDate: targetDateStr, 
		endDate: targetDateEndStr,
		size: 200
	};
	
	// hideStatusIds가 있으면 추가
	if (hideStatusIds && hideStatusIds.length > 0) {
		selectedDateOptions.hideStatusIds = hideStatusIds;
	}

	// 2. 일주일간의 데이터 조회를 위한 옵션 (오늘 기준 앞뒤 3일)
	const today = new Date();
	const start = new Date(today);
	start.setDate(today.getDate() - 3);
	const end = new Date(today);
	end.setDate(today.getDate() + 3);
	
	/** @type {any} */
	let weeklyOptions = { 
		startDate: formatDateWithTimezone(start, '00:00:00'), 
		endDate: formatDateWithTimezone(end, '23:59:59'),
		size: 200
	};
	
	// hideStatusIds가 있으면 weekly 옵션에도 추가
	if (hideStatusIds && hideStatusIds.length > 0) {
		weeklyOptions.hideStatusIds = hideStatusIds;
	}

	// 두 번의 API 호출로 각각의 데이터 조회
	const [selectedDateResult, weeklyResult] = await Promise.all([
		zzic.todo.getTodos(selectedDateOptions),
		zzic.todo.getTodos(weeklyOptions),
	]);

	if (selectedDateResult.error) error(selectedDateResult.error.message);
	if (weeklyResult.error) error(weeklyResult.error.message);

	return {
		selectedDateTodos: selectedDateResult.data,
		weeklyTodos: weeklyResult.data,
	};
}
