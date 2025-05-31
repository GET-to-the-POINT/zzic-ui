
/**
 * @typedef {Object} ItemMainResponse
 * @property {number} id - 할 일 항목의 고유 식별자
 * @property {string} title - 할 일 항목의 제목
 * @property {boolean} done - 할 일 항목의 완료 여부
 */

import { browser } from "$app/environment";

/**
 * @typedef {Object} ItemPageResponse
 * @property {ItemMainResponse[]} content - 할 일 목록
 * @property {number} pageNumber - 현재 페이지 번호 (0부터 시작)
 * @property {number} pageSize - 페이지 크기
 * @property {number} totalElements - 총 요소 개수
 * @property {number} totalPages - 총 페이지 개수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 * @property {boolean} empty - 비어있는 페이지 여부
 */

/**
 * @typedef {Object} CreateItemRequest
 * @property {string} title - 할 일 항목의 제목
 */

/**
 * @typedef {Object} UpdateItemRequest
 * @property {string} [title] - 할 일 항목의 제목
 * @property {boolean} [done] - 할 일 항목의 완료 여부
 */

/**
 * @typedef {Object} ApiResponse
 * @property {any} data - 응답 데이터
 * @property {Object|null} error - 에러 정보
 */

/**
 * 클라이언트 팩토리 함수
 * @param {string} apiUrl - API 서버 URL
 * @param {Function} fetchFn - fetch 함수
 * @returns {Object} 클라이언트 객체
 */
export function createTodoClient(apiUrl, fetchFn) {
	return {
		/**
		 * 목록 조회
		 * @param {string} memberId - 멤버 ID
		 * @returns {Promise<{data: ItemPageResponse|null, error: Object|null}>}
		 */
		async getTodos(memberId) {
			let options = {};
			if (browser) {
				options.credentials = 'include'; // 브라우저 환경에서는 쿠키를 포함
			}
			const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos`, { ...options });
			if (!response.ok) {
				const error = await response.text();
				return { data: null, error };
			}
			/** @type {ItemPageResponse} */
			const data = await response.json();
			return { data, error: null };
		},

		/**
		 * 생성 (브라우저용 - me 사용)
		 * @param {CreateItemRequest} taskData - 생성할 할 일 데이터
		 * @returns {Promise<{data: {success: boolean}|null, error: Object|null}>}
		 */
		async createTodo(taskData) {
			let options = {};
			if (browser) {
				options.credentials = 'include'; // 브라우저 환경에서는 쿠키를 포함
			}
			const response = await fetchFn(`${apiUrl}/api/members/me/todos`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(taskData),
				...options
			});
			if (response.status !== 201) { // API 문서 기준 201
				const error = await response.json().catch(() => ({ message: 'Failed to create todo' }));
				return { data: null, error };
			}
			// 201 Created 응답은 일반적으로 본문이 없거나, 생성된 리소스의 위치를 반환합니다.
			// API 문서에 따르면 생성된 Todo를 반환하지 않으므로, 성공 여부만 반환하거나, getTodos를 다시 호출해야 합니다.
			// 여기서는 성공 여부만 반환하도록 단순화합니다. 필요시 +page.server.js에서 목록을 다시 로드해야 합니다.
			return { data: { success: true }, error: null };
		},

		/**
		 * 생성 (서버용 - memberId 직접 지정)
		 * @param {string} memberId - 멤버 ID
		 * @param {CreateItemRequest} taskData - 생성할 할 일 데이터
		 * @returns {Promise<{error: Object|null}>}
		 */
		async createTodoForMember(memberId, taskData) {
			let options = {};
			if (browser) {
				options.credentials = 'include'; // 브라우저 환경에서는 쿠키를 포함
			}
			const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(taskData),
				...options
			});
			if (response.status !== 201) {
				const error = await response.json().catch(() => ({ message: 'Failed to create todo' }));
				return { error };
			}
			return { error: null };
		},

		/**
		 * 업데이트
		 * @param {string} id - 할 일 항목 ID
		 * @param {UpdateItemRequest} taskData - 업데이트할 할 일 데이터
		 * @returns {Promise<{data: {success: boolean}|null, error: Object|null}>}
		 */
		async updateTodo(id, taskData) {
			let options = {};
			if (browser) {
				options.credentials = 'include'; // 브라우저 환경에서는 쿠키를 포함
			}
			const response = await fetchFn(`${apiUrl}/api/members/me/todos/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(taskData),
				...options
			});
			if (response.status !== 204) { // API 문서 기준 204
				const error = await response.json().catch(() => ({ message: 'Failed to update todo' }));
				return { data: null, error };
			}
			// 204 No Content 응답은 본문이 없습니다.
			return { data: { success: true }, error: null };
		}
	};
}
