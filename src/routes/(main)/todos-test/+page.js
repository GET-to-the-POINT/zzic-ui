import { error } from '@sveltejs/kit';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

// dayjs 플러그인 초기화
dayjs.extend(utc);
dayjs.extend(timezone);

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
 * @property {Array<import('$lib/zzic-api/todo.js').PageTodoResponse>} weeklyTodos - 일주일간의 todo 데이터 배열 (각 날짜별 존재 여부 확인용)
 */

// 이 페이지만의 특별한 스키마 정의
const testPageSchema = z.object({
	startDate: z
		.string()
		.refine((dateStr) => {
			const date = new Date(dateStr);
			return !isNaN(date.getTime());
		}, '유효하지 않은 시작 날짜입니다')
		.optional(),
	endDate: z
		.string()
		.refine((dateStr) => {
			const date = new Date(dateStr);
			return !isNaN(date.getTime());
		}, '유효하지 않은 종료 날짜입니다')
		.optional(),
	hideStatusIds: z
		.string()
		.transform((str) => str.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)))
		.optional()
});

/**
 * 기본 날짜 범위를 생성합니다 (사용자 타임존 기준 오늘 00시 ~ 내일 00시를 UTC로 변환)
 * @param {string} timeZone - 사용자 타임존 (예: 'Asia/Seoul')
 * @returns {{ startDate: string, endDate: string }} ISO 문자열 형태의 날짜 범위
 */
function getDefaultDateRange(timeZone) {
	const todayStart = dayjs().tz(timeZone).startOf('day');
	const tomorrowStart = todayStart.add(1, 'day');
	
	return {
		startDate: todayStart.utc().toISOString(),
		endDate: tomorrowStart.utc().toISOString()
	};
}

/**
 * 위클리 데이터를 위한 7개 날짜 범위 생성 (3일 전 ~ 3일 후)
 * @param {string} timeZone - 사용자 타임존
 * @returns {Array<{startDate: string, endDate: string}>} 7개 날짜의 범위 배열
 */
function getWeeklyDateRanges(timeZone) {
	const ranges = [];
	
	for (let i = -3; i <= 3; i++) {
		const dayStart = dayjs().tz(timeZone).add(i, 'day').startOf('day');
		const dayEnd = dayStart.add(1, 'day');
		
		ranges.push({
			startDate: dayStart.utc().toISOString(),
			endDate: dayEnd.utc().toISOString()
		});
	}
	
	return ranges;
}

/**
 * Todo 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} Todo 페이지 데이터
 */
export async function load({ parent, url }) {
	const { zzic, user } = await parent();

	// URL 검색 파라미터를 Zod로 파싱 및 검증
	const rawParams = Object.fromEntries(url.searchParams.entries());
	const parsedParams = testPageSchema.safeParse(rawParams);
	
	if (!parsedParams.success) {
		// 파싱 실패시 에러 발생
		const errorDetails = parsedParams.error.issues.map(/** @type {any} */ issue => 
			`필드 '${issue.path.join('.')}': ${issue.message}`
		).join(', ');
		
		console.info('URL 파라미터 파싱 실패:', {
			rawParams,
			errors: parsedParams.error.format()
		});
		
		error(400, `잘못된 URL 파라미터입니다. ${errorDetails}`);
	}

	// startDate와 endDate가 없으면 기본값 설정 (사용자 타임존 고려)
	if (!url.searchParams.has('startDate') || !url.searchParams.has('endDate')) {
		const { startDate, endDate } = getDefaultDateRange(user.timeZone);

		if (!url.searchParams.has('startDate')) url.searchParams.set('startDate', startDate);
		if (!url.searchParams.has('endDate')) url.searchParams.set('endDate', endDate);

		console.info('기본 날짜 범위 설정:', {
			startDate,
			endDate,
			timeZone: user.timeZone
		});
	}

	// 수정된 검색 파라미터를 사용하여 getTodos 호출
	const todosResult = await zzic.todo.getTodos(url.searchParams);

	if (todosResult.error) error(todosResult.error.message);

	// 위클리 데이터 생성 (7일간의 TODO 존재 여부 확인용)
	const weeklyRanges = getWeeklyDateRanges(user.timeZone);
	const weeklyTodos = await Promise.all(
		weeklyRanges.map(async (range, index) => {
			// 기존 파라미터를 복사하되, 날짜 범위와 size만 변경
			const weeklyParams = new URLSearchParams(url.searchParams);
			weeklyParams.set('startDate', range.startDate);
			weeklyParams.set('endDate', range.endDate);
			weeklyParams.set('size', '1'); // 존재 여부만 확인하므로 1개만 요청
			
			const result = await zzic.todo.getTodos(weeklyParams);
			
			// 날짜 정보를 함께 담아서 반환
			const date = dayjs().tz(user.timeZone).add(index - 3, 'day');
			const dayStart = date.startOf('day');
			const dayEnd = dayStart.add(1, 'day');
			
			return {
				date: date.toDate(),
				day: date.format('ddd'), // 요일 (짧은 형태)
				dayNumber: date.date(), // 날짜 숫자
				startDate: dayStart.toISOString(), // 사용자 타임존 기준
				endDate: dayEnd.toISOString(), // 사용자 타임존 기준
				ariaLabel: date.format('YYYY년 M월 D일 dddd'),
				...(result.error ? { empty: true } : result.data)
			};
		})
	);

	return {
		selectedDateTodos: todosResult.data,
		weeklyTodos: weeklyTodos,
	};
}
