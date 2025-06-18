/**
 * Todo 도메인 타입 정의
 */

/**
 * @typedef {Object} TodoResponse
 * @property {number} id - Todo ID
 * @property {string} title - 할일 제목
 * @property {string} [description] - 할일 설명
 * @property {number} statusId - 상태
 * @property {string} statusName - 상태
 * @property {number} [priorityId] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {string} [priorityName] - 우선순위명
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [categoryName] - 카테고리명
 * @property {string} [dueDate] - 마감일 (YYYY-MM-DD)
 * @property {'NONE'|'DAILY'|'WEEKLY'|'MONTHLY'|'YEARLY'} [repeatType] - 반복 유형
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
 * @property {number} [status] - 상태
 * @property {number} [priority] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [dueDate] - 마감일 (YYYY-MM-DD)
 * @property {'NONE'|'DAILY'|'WEEKLY'|'MONTHLY'|'YEARLY'} [repeatType] - 반복 유형
 * @property {string} [tags] - 태그 목록 (쉼표로 구분)
 */

/**
 * @typedef {Object} UpdateTodoRequest
 * @property {string} [title] - 할 일 제목
 * @property {string} [description] - 할 일 설명
 * @property {'IN_PROGRESS'|'COMPLETED'} [status] - 상태
 * @property {number} [priority] - 우선순위 (0: 낮음, 1: 보통, 2: 높음)
 * @property {number} [categoryId] - 카테고리 ID
 * @property {string} [dueDate] - 마감일 (YYYY-MM-DD)
 * @property {'NONE'|'DAILY'|'WEEKLY'|'MONTHLY'|'YEARLY'} [repeatType] - 반복 유형
 * @property {string} [tags] - 태그 목록 (쉼표로 구분)
 */

/**
 * @typedef {Object} TodoStatisticsResponse
 * @property {number} total - 전체 개수
 * @property {number} inProgress - 진행중 개수
 * @property {number} completed - 완료 개수
 * @property {number} overdue - 지연 개수
 */

/**
 * @typedef {import('./types.js').ApiResponse} ApiResponse
 * @typedef {import('./types.js').ApiError} ApiError
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
	 * @param {string} memberId - 멤버 ID
	 * @param {Object} [options={}] - 옵션
	 * @param {'IN_PROGRESS'|'COMPLETED'|'OVERDUE'} [options.status] - 상태 필터
	 * @param {number} [options.page] - 페이지 번호
	 * @param {number} [options.size] - 페이지 크기
	 * @param {string} [options.sort] - 정렬 옵션
	 * @returns {Promise<{data: PageTodoResponse|null, error: ApiError|null}>}
	 */
	async function getTodos(memberId, options = {}) {
		const url = new URL(`${apiUrl}/todos`);
		Object.entries(options).forEach(([key, value]) => {
			if (value != null) {
				url.searchParams.append(key, String(value));
			}
		});

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
			return { data: null, error };
		}
	}

	/**
	 * 특정 할 일 조회
	 * @param {string} memberId - 멤버 ID
	 * @param {number} todoId - 할 일 ID
	 * @returns {Promise<{data: TodoResponse|null, error: ApiError|null}>}
	 */
	async function getTodo(memberId, todoId) {
		try {
			const url = new URL(`${apiUrl}/todos/${todoId}`);
			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.text();
				return { data: null, error };
			}

			/** @type {TodoResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 할 일 생성
	 * @param {CreateTodoRequest} todo - 할 일 생성 데이터
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function createTodo(todo) {
		try {
			const url = new URL(`${apiUrl}/todos`);
			const test = url.toString();
			const response = await fetchFn(test, {
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
		} catch (error) {
			return { error };
		}
	}

	/**
	 * 할 일 수정
	 * @param {number} todoId - 할 일 ID
	 * @param {UpdateTodoRequest} todo - 할 일 수정 데이터
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function updateTodo({todoId}, todo) {
		try {
			const url = new URL(`${apiUrl}/todos/${todoId}`);
			const response = await fetchFn(url.toString(), {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(todo),
				credentials: 'include'
			});

			if (response.status !== 204) {
				const error = await response.json().catch(() => ({ message: 'Failed to update todo' }));
				return { error };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	/**
	 * 할 일 삭제
	 * @param {number} todoId - 할 일 ID
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
			return { error };
		}
	}

	/**
	 * 할 일 통계 조회
	 * @param {string} memberId - 멤버 ID
	 * @returns {Promise<{data: TodoStatisticsResponse|null, error: ApiError|null}>}
	 */
	async function getTodoStatistics(memberId) {
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
			return { data: null, error };
		}
	}

	// 레거시 호환성을 위한 alias 메서드
	/**
	 * 멤버의 할 일 생성 (레거시 호환성)
	 * @param {string} memberId - 멤버 ID
	 * @param {CreateTodoRequest} todo - 할 일 생성 데이터
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function createTodoForMember(memberId, todo) {
		return createTodo(memberId, todo);
	}

	return {
		getTodos,
		getTodo,
		createTodo,
		createTodoForMember,
		updateTodo,
		deleteTodo,
		getTodoStatistics
	};
}
