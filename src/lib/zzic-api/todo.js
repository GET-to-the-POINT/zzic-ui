/**
 * @typedef {Object} ItemMainResponse
 * @property {number} id - 할 일 항목의 고유 식별자
 * @property {string} title - 할 일 항목의 제목
 * @property {boolean} done - 할 일 항목의 완료 여부
 */

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
	// 각 메서드의 구현을 함수로 분리
	async function getTodos(memberId, options = { }) {
		const url = new URL(`${apiUrl}/api/members/${memberId}/todos`);
		Object.entries(options).forEach(([key, value]) => {
			if (value != null) {
				url.searchParams.append(key, String(value));
			}
		});
		const response = await fetchFn(url.toString(), {
			credentials: 'include',
		});
		if (!response.ok) {
			const error = await response.text();
			return { data: null, error };
		}
		/** @type {ItemPageResponse} */
		const data = await response.json();
		return { data, error: null };
	}

	async function createTodo({ userId }, todo) {
		const response = await fetchFn(`${apiUrl}/api/members/${userId}/todos`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(todo),
			credentials: 'include'
		});
		if (response.status !== 201) {
			const error = await response.json().catch(() => ({ message: 'Failed to create todo' }));
			return { error };
		}
		return { error: null };
	}

	async function createTodoForMember(memberId, todo) {
		const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(todo),
			credentials: 'include'
		});
		if (response.status !== 201) {
			const error = await response.json().catch(() => ({ message: 'Failed to create todo' }));
			return { error };
		}
		return { error: null };
	}

	async function updateTodo({userId, todoId}, todo) {
		const response = await fetchFn(`${apiUrl}/api/members/${userId}/todos/${todoId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(todo),
			credentials: 'include'
		});
		if (response.status !== 204) {
			const error = await response.json().catch(() => ({ message: 'Failed to update todo' }));
			return { error };
		}
		return { error: null };
	}

	// 변수에 함수 할당 후 반환
	return {
		getTodos,
		createTodo,
		createTodoForMember,
		updateTodo
	};
}
