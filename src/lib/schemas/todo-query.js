import { z } from 'zod';

/**
 * Todo 목록 조회를 위한 공통 쿼리 파라미터 스키마
 */
export const todoQuerySchema = z.object({
	// 완료 상태 필터
	complete: z
		.string()
		.transform((str) => {
			if (str === 'true') return true;
			if (str === 'false') return false;
			return undefined;
		})
		.optional(),
	// 배열 파라미터들 - 쉼표로 구분된 문자열을 배열로 변환
	categoryIds: z
		.string()
		.transform((str) =>
			str
				.split(',')
				.map((id) => Number(id.trim()))
				.filter((id) => !isNaN(id))
		)
		.optional(),
	priorityIds: z
		.string()
		.transform((str) =>
			str
				.split(',')
				.map((id) => Number(id.trim()))
				.filter((id) => !isNaN(id))
		)
		.optional(),
	tags: z
		.string()
		.transform((str) =>
			str
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0)
		)
		.optional(),

	// 단일 값 파라미터들
	startDate: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/,
			'YYYY-MM-DDTHH:mm:ss±HH:MM 형식이어야 합니다'
		)
		.refine((dateStr) => {
			const date = new Date(dateStr);
			return !isNaN(date.getTime());
		}, '유효하지 않은 날짜입니다')
		.optional(),
	endDate: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/,
			'YYYY-MM-DDTHH:mm:ss±HH:MM 형식이어야 합니다'
		)
		.refine((dateStr) => {
			const date = new Date(dateStr);
			return !isNaN(date.getTime());
		}, '유효하지 않은 날짜입니다')
		.optional(),
	keyword: z.string().optional(),
	page: z
		.string()
		.transform((str) => Number(str))
		.refine((num) => !isNaN(num) && num >= 0, '페이지는 0 이상의 숫자여야 합니다')
		.optional(),
	size: z
		.string()
		.transform((str) => Number(str))
		.refine((num) => !isNaN(num) && num > 0, '크기는 0보다 큰 숫자여야 합니다')
		.optional()
});

/**
 * 간단한 Todo 페이지용 스키마 (날짜와 탭 정보 포함)
 */
export const simpleTodoPageSchema = z.object({
	date: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/,
			'YYYY-MM-DDTHH:mm:ss±HH:MM 형식이어야 합니다 (타임존 정보 필수)'
		)
		.refine((dateStr) => {
			const date = new Date(dateStr);
			return !isNaN(date.getTime());
		}, '유효하지 않은 날짜입니다')
		.transform((dateStr) => new Date(dateStr))
		.optional(),
	tab: z.enum(['full', 'simple']).optional().default('full')
});

/**
 * URL 쿼리 파라미터를 검증하고 API 옵션으로 변환하는 헬퍼 함수
 * @param {URLSearchParams} searchParams - URL 검색 파라미터
 * @param {Object} additionalOptions - 추가 옵션 (예: 기본값들)
 * @returns {{success: boolean, data?: any, error?: any, searchParams?: URLSearchParams}} 검증 결과
 */
export function validateAndPrepareOptions(searchParams, additionalOptions = {}) {
	const rawParams = Object.fromEntries(searchParams.entries());
	const parseResult = todoQuerySchema.safeParse(rawParams);

	if (!parseResult.success) {
		return {
			success: false,
			error: parseResult.error
		};
	}

	// 검증된 데이터를 다시 URLSearchParams로 변환
	const finalParams = new URLSearchParams();

	// 추가 옵션 먼저 추가
	for (const [key, value] of Object.entries(additionalOptions)) {
		if (value === undefined || value === null) continue;

		if (Array.isArray(value)) {
			value.forEach((item) => finalParams.append(key, String(item)));
		} else {
			finalParams.append(key, String(value));
		}
	}

	// 검증된 데이터 추가
	for (const [key, value] of Object.entries(/** @type {any} */ (parseResult.data))) {
		if (value === undefined || value === null) continue;

		if (Array.isArray(value)) {
			/** @type {any[]} */ (value).forEach(
				/** @type {any} */ (item) => finalParams.append(key, String(item))
			);
		} else {
			finalParams.append(key, String(value));
		}
	}

	return {
		success: true,
		data: parseResult.data,
		searchParams: finalParams
	};
}
