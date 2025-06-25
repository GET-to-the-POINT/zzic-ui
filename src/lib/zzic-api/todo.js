/**
 * Todo 도메인 타입 정의
 */

import { Temporal } from '@js-temporal/polyfill';

/**
 * LocalDate, LocalTime을 Temporal로 변환하는 유틸리티 함수들
 */

/**
 * 서버에서 받은 LocalDate 문자열(YYYY-MM-DD)을 Temporal.PlainDate로 변환
 * @param {string} localDateStr - YYYY-MM-DD 형식의 날짜 문자열
 * @returns {any} Temporal.PlainDate
 */
export function parseLocalDate(localDateStr) {
	return Temporal.PlainDate.from(localDateStr);
}

/**
 * 서버에서 받은 LocalTime 문자열(HH:mm 또는 HH:mm:ss)을 Temporal.PlainTime으로 변환
 * @param {string} localTimeStr - HH:mm 또는 HH:mm:ss 형식의 시간 문자열
 * @returns {any} Temporal.PlainTime
 */
export function parseLocalTime(localTimeStr) {
	return Temporal.PlainTime.from(localTimeStr);
}

/**
 * LocalDate와 LocalTime을 결합하여 Temporal.PlainDateTime 생성
 * @param {string} localDateStr - YYYY-MM-DD 형식의 날짜 문자열
 * @param {string} [localTimeStr] - HH:mm 형식의 시간 문자열 (선택적)
 * @returns {any} Temporal.PlainDateTime
 */
export function combineLocalDateTime(localDateStr, localTimeStr) {
	const date = parseLocalDate(localDateStr);
	if (localTimeStr) {
		const time = parseLocalTime(localTimeStr);
		return date.toPlainDateTime(time);
	}
	return date.toPlainDateTime();
}

/**
 * Temporal.PlainDate를 서버 형식(YYYY-MM-DD)으로 변환
 * @param {any} plainDate - Temporal.PlainDate
 * @returns {string}
 */
export function formatLocalDate(plainDate) {
	return plainDate.toString();
}

/**
 * Temporal.PlainTime을 서버 형식(HH:mm)으로 변환
 * @param {any} plainTime - Temporal.PlainTime
 * @returns {string}
 */
export function formatLocalTime(plainTime) {
	return plainTime.toString({ smallestUnit: 'minute' });
}

/**
 * Temporal.PlainDateTime을 LocalDate, LocalTime으로 분리
 * @param {any} plainDateTime - Temporal.PlainDateTime
 * @returns {{ localDate: string, localTime: string }}
 */
export function splitLocalDateTime(plainDateTime) {
	return {
		localDate: formatLocalDate(plainDateTime.toPlainDate()),
		localTime: formatLocalTime(plainDateTime.toPlainTime())
	};
}

/**
 * @typedef {Object} TodoResponse
 * @property {number} id - Todo ID
 * @property {string} title - 할일 제목
 * @property {string} [description] - 할일 설명
 * @property {number} statusId - 상태 (0: 진행중, 1: 완료, 2: 지연)
 * @property {string} statusName - 상태명
 * @property {number} [priorityId] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {string} [priorityName] - 우선순위명
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [categoryName] - 카테고리명
 * @property {string} [dueDate] - 마감 날짜 (YYYY-MM-DD)
 * @property {string} [dueTime] - 마감 시간 (HH:mm)
 * @property {'NONE'|'DAILY'|'WEEKLY'|'MONTHLY'} [repeatType] - 반복 유형
 * @property {string[]} [tags] - 태그 목록
 */

/**
 * @typedef {Object} PageTodoResponse
 * @property {number} totalElements - 전체 요소 수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 * @property {number} size - 페이지 크기
 * @property {TodoResponse[]} content - 할 일 목록
 * @property {number} number - 현재 페이지 번호
 * @property {number} numberOfElements - 현재 페이지 요소 수
 * @property {boolean} empty - 빈 페이지 여부
 */

/**
 * @typedef {Object} CreateTodoRequest
 * @property {string} title - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {number} [statusId] - 상태 (0: 진행중, 1: 완료)
 * @property {number} [priorityId] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [dueDate] - 마감 날짜 (YYYY-MM-DD)
 * @property {string} [dueTime] - 마감 시간 (HH:mm)
 * @property {'NONE'|'DAILY'|'WEEKLY'|'MONTHLY'} [repeatType] - 반복 유형
 * @property {string} [tags] - 태그 목록 (쉼표로 구분)
 */

/**
 * @typedef {Object} UpdateTodoRequest
 * @property {string} [title] - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {number} [statusId] - 상태 (0: 진행중, 1: 완료)
 * @property {number} [priorityId] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [dueDate] - 마감 날짜 (YYYY-MM-DD)
 * @property {string} [dueTime] - 마감 시간 (HH:mm)
 * @property {'NONE'|'DAILY'|'WEEKLY'|'MONTHLY'} [repeatType] - 반복 유형
 * @property {string} [tags] - 태그 목록 (쉼표로 구분)
 */

/**
 * @typedef {Object} UpdateTodoFormFields
 * @description FormData로 전송할 수 있는 할 일 수정 필드들의 타입 정의 (참고용)
 * @property {string} [title] - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {string} [statusId] - 상태 ID
 * @property {string} [priorityId] - 우선순위 ID
 * @property {string} [categoryId] - 카테고리 ID
 * @property {string} [dueDate] - 마감 날짜 (YYYY-MM-DD)
 * @property {string} [dueTime] - 마감 시간 (HH:mm)  
 * @property {string} [repeatType] - 반복 유형 ('NONE'|'DAILY'|'WEEKLY'|'MONTHLY')
 * @property {string} [tags] - 태그 목록 (쉼표로 구분)
 */

/**
 * @typedef {Object} StatisticsItem
 * @property {string} statisticsName - 항목 이름
 * @property {number} statisticsValue - 항목 값
 */

/**
 * @typedef {Object} TodoStatisticsResponse
 * @property {StatisticsItem[]} content - 통계 데이터 목록
 */

/**
 * @typedef {Object} ApiResponse
 * @property {any} data - 응답 데이터
 * @property {ApiError|null} error - 에러 정보
 */

/**
 * @typedef {Object} ApiError
 * @property {number} [status] - HTTP 상태 코드
 * @property {string} message - 에러 메시지
 */

/**
 * 클라이언트 팩토리 함수
 * @param {string} apiUrl - API 서버 URL
 * @param {Function} fetchFn - fetch 함수
 * @returns {Object} 클라이언트 객체
 */
export function createTodoClient(apiUrl, fetchFn) {
	/**
	 * 할 일 목록 조회
	 * @param {URLSearchParams} [searchParams] - URL 검색 파라미터 (그대로 전달)
	 * @returns {Promise<{data: PageTodoResponse|null, error: ApiError|null}>}
	 */
	async function getTodos(searchParams) {
		const url = new URL(`${apiUrl}/todos`);
		
		// URLSearchParams를 그대로 URL에 적용
		if (searchParams) {
			url.search = searchParams.toString();
		}

		try {
			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
				return { data: null, error };
			}
		/** @type {PageTodoResponse} */
		const data = await response.json();

		return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {any} */ (error) };
		}
	}

	/**
	 * 특정 할 일 조회
	 * @param {Object} params - 파라미터 객체
	 * @param {number} params.todoId - 할 일 ID
	 * @returns {Promise<{data: TodoResponse|null, error: ApiError|null}>}
	 */
	async function getTodo({todoId}) {
		try {
			const url = new URL(`${apiUrl}/todos/${todoId}`);
			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.text();
				return { data: null, error: /** @type {any} */ (error) };
			}

			/** @type {TodoResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {any} */ (error) };
		}
	}

	/**
	 * 할 일 생성
	 * @param {FormData} [formData] - 생성 요청에 사용할 FormData 객체
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function createTodo(formData) {
		try {
			const url = new URL(`${apiUrl}/todos`);
			const response = await fetchFn(url.toString(), {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});

			if (!response.ok ) {
				const error = await response.json().catch(() => ({ message: 'Failed to create todo' }));
				return { error };
			}

			return { error: null };
		} catch (error) {
			return { error: /** @type {any} */ (error) };
		}
	}

	/**
	 * 할 일 수정
	 * @param {Object} params - 파라미터 객체
	 * @param {number} params.todoId - 할 일 ID
	 * @param {FormData} formData - 할 일 데이터 FormData 객체
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function updateTodo({todoId}, formData) {
		try {
			const url = new URL(`${apiUrl}/todos/${todoId}`);
			const response = await fetchFn(url.toString(), {
				method: 'PATCH',
				body: formData,
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({ message: 'Failed to update todo' }));
				return { error };
			}

			return { error: null };
		} catch (error) {
			return { error: /** @type {any} */ (error) };
		}
	}

	/**
	 * 할 일 삭제
	 * @param {Object} params - 파라미터 객체
	 * @param {number} params.todoId - 할 일 ID
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function deleteTodo({todoId}) {
		try {
			const url = new URL(`${apiUrl}/todos/${todoId}`);
			const response = await fetchFn(url.toString(), {
				method: 'DELETE',
				credentials: 'include'
			});

			if (response.status !== 204) {
				const error = await response.json();
				return { error };
			}

			return { error: null };
		} catch (error) {
			return { error: /** @type {any} */ (error) };
		}
	}

	/**
	 * 할 일 통계 조회
	 * @returns {Promise<{data: TodoStatisticsResponse|null, error: ApiError|null}>}
	 */
	async function getTodoStatistics() {
		try {
			const url = new URL(`${apiUrl}/todos/statistics`);
			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
				return { data: null, error };
			}

			/** @type {TodoStatisticsResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {any} */ (error) };
		}
	}

	return {
		getTodos,
		getTodo,
		createTodo,
		updateTodo,
		deleteTodo,
		getTodoStatistics
	};
}
