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
 * @property {string} id - Todo ID (가상 투두의 경우 '원본ID:반복순서' 형식)
 * @property {string} title - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {boolean} complete - 완료 여부 (true: 완료, false: 미완료)
 * @property {boolean} [isPinned] - 상단 고정 여부
 * @property {number} [displayOrder] - 정렬 순서 (0이 가장 먼저)
 * @property {number} [priorityId] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {string} [priorityName] - 우선순위명
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [categoryName] - 카테고리명
 * @property {string} [date] - 마감 날짜 (YYYY-MM-DD)
 * @property {string} [time] - 마감 시간 (HH:mm)
 * @property {number} [repeatType] - 반복 유형 (0: 반복 안함, 1: 데일리, 2: 위클리, 3: 먼슬리, 4: 이얼리)
 * @property {number} [repeatInterval] - 반복 간격 (일 단위)
 * @property {number[]} [daysOfWeek] - 매주 반복 시 선택된 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 * @property {string} [repeatEndDate] - 반복 종료일
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
 * @property {boolean} [complete] - 완료 여부 (true: 완료, false: 미완료)
 * @property {number} [priorityId] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [date] - 마감 날짜 (YYYY-MM-DD)
 * @property {string} [time] - 마감 시간 (HH:mm)
 * @property {number} [repeatType] - 반복 유형 (0: 반복 안함, 1: 데일리, 2: 위클리, 3: 먼슬리, 4: 이얼리)
 * @property {number} [repeatInterval] - 반복 간격 (일 단위)
 * @property {number[]} [daysOfWeek] - 매주 반복 시 선택된 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 * @property {string} [repeatStartDate] - 반복 시작일 (YYYY-MM-DD)
 * @property {string} [repeatEndDate] - 반복 종료일 (YYYY-MM-DD)
 * @property {string[]} [tags] - 태그 목록
 */

/**
 * @typedef {Object} UpdateTodoRequest
 * @property {string} [title] - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {boolean} [complete] - 완료 여부 (true: 완료, false: 미완료)
 * @property {number} [priorityId] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [date] - 마감 날짜 (YYYY-MM-DD)
 * @property {string} [time] - 마감 시간 (HH:mm)
 * @property {number} [repeatType] - 반복 유형 (0: 반복 안함, 1: 데일리, 2: 위클리, 3: 먼슬리, 4: 이얼리)
 * @property {number} [repeatInterval] - 반복 간격 (일 단위)
 * @property {number[]} [daysOfWeek] - 매주 반복 시 선택된 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 * @property {string} [repeatStartDate] - 반복 시작일 (YYYY-MM-DD)
 * @property {string} [repeatEndDate] - 반복 종료일 (YYYY-MM-DD)
 * @property {string[]} [tags] - 태그 목록
 */

/**
 * @typedef {Object} UpdateTodoFormFields
 * @description FormData로 전송할 수 있는 할 일 수정 필드들의 타입 정의 (참고용)
 * @property {string} [title] - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {string} [complete] - 완료 여부 ("true" 또는 "false")
 * @property {string} [priorityId] - 우선순위 ID
 * @property {string} [categoryId] - 카테고리 ID
 * @property {string} [date] - 마감 날짜 (YYYY-MM-DD)
 * @property {string} [time] - 마감 시간 (HH:mm)
 * @property {string} [repeatType] - 반복 유형 (0|1|2|3|4)
 * @property {string[]} [tags] - 태그 목록
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
 * @typedef {Object} CalendarTodoStatusResponse
 * @property {string} date - 날짜 (YYYY-MM-DD)
 * @property {boolean} hasTodo - 해당 날짜에 Todo 존재 여부
 */

/**
 * @typedef {Object} DeleteTodoRequest
 * @property {boolean} deleteAll - 전체 삭제 여부 (true: 원본 포함 전체 삭제, false: 해당 날짜만 숨김)
 */

/**
 * @typedef {Object} TodoStatistics
 * @property {number} total - 전체 개수
 * @property {number} inProgress - 진행중 개수
 * @property {number} completed - 완료 개수
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
				const error = await response.text();
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
	 * @param {number|string} params.todoId - 할 일 ID (반복 투두의 경우 'id:daysDifference' 형식)
	 * @param {number} [params.daysDifference] - 반복 투두의 날짜 차이
	 * @returns {Promise<{data: TodoResponse|null, error: ApiError|null}>}
	 */
	async function getTodo({ todoId, daysDifference }) {
		try {
			let url;
			if (daysDifference !== undefined) {
				url = new URL(`${apiUrl}/todos/${todoId}:${daysDifference}`);
			} else {
				url = new URL(`${apiUrl}/todos/${todoId}`);
			}

			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
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

			if (!response.ok) {
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
	 * @param {number|string} params.todoId - 할 일 ID (반복 투두의 경우 'id:daysDifference' 형식)
	 * @param {number} [params.daysDifference] - 반복 투두의 날짜 차이
	 * @param {FormData} formData - 할 일 데이터 FormData 객체
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function updateTodo({ todoId, daysDifference }, formData) {
		try {
			let url;
			if (daysDifference !== undefined) {
				url = new URL(`${apiUrl}/todos/${todoId}:${daysDifference}`);
			} else {
				url = new URL(`${apiUrl}/todos/${todoId}`);
			}

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
	 * @param {number|string} params.todoId - 할 일 ID (반복 투두의 경우 'id:daysDifference' 형식)
	 * @param {number} [params.daysDifference] - 반복 투두의 날짜 차이
	 * @param {boolean} [params.deleteAll] - 전체 삭제 여부 (true: 원본 포함 전체 삭제, false: 해당 날짜만 숨김)
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function deleteTodo({ todoId, daysDifference, deleteAll = false }) {
		try {
			let url;
			if (daysDifference !== undefined) {
				url = new URL(`${apiUrl}/todos/${todoId}:${daysDifference}`);
			} else {
				url = new URL(`${apiUrl}/todos/${todoId}`);
			}

			// FormData 생성하여 deleteAll 파라미터 추가
			const formData = new FormData();
			formData.append('deleteAll', deleteAll.toString());

			const response = await fetchFn(url.toString(), {
				method: 'DELETE',
				body: formData,
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
	 * @param {string} [date] - 조회할 날짜 (YYYY-MM-DD)
	 * @returns {Promise<{data: TodoStatistics|null, error: ApiError|null}>}
	 */
	async function getTodoStatistics(date) {
		try {
			const url = new URL(`${apiUrl}/todos/statistics`);
			if (date) {
				url.searchParams.append('date', date);
			}

			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
				return { data: null, error };
			}

			/** @type {TodoStatistics} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {any} */ (error) };
		}
	}

	/**
	 * 월별 캘린더 Todo 현황 조회
	 * @param {URLSearchParams} searchParams - year, month가 포함된 검색 파라미터
	 * @returns {Promise<{data: CalendarTodoStatusResponse[]|null, error: ApiError|null}>}
	 */
	async function getMonthlyCalendarTodos(searchParams) {
		try {
			const url = new URL(`${apiUrl}/todos/calendar/monthly`);
			if (searchParams) {
				url.search = searchParams.toString();
			}

			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
				return { data: null, error };
			}

			/** @type {CalendarTodoStatusResponse[]} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {any} */ (error) };
		}
	}

	/**
	 * 할 일 상단 고정 토글
	 * @param {Object} params - 파라미터 객체
	 * @param {number|string} params.todoId - 할 일 ID (반복 투두의 경우 'id:daysDifference' 형식)
	 * @param {number} [params.daysDifference] - 반복 투두의 날짜 차이
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function togglePin({ todoId, daysDifference }) {
		try {
			let url;
			if (daysDifference !== undefined) {
				url = new URL(`${apiUrl}/todos/${todoId}:${daysDifference}/pin`);
			} else {
				url = new URL(`${apiUrl}/todos/${todoId}/pin`);
			}

			const response = await fetchFn(url.toString(), {
				method: 'PATCH',
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

	return {
		getTodos,
		getTodo,
		createTodo,
		updateTodo,
		deleteTodo,
		getTodoStatistics,
		getMonthlyCalendarTodos,
		togglePin
	};
}
