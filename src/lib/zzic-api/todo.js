/**
 * @typedef {Object} TodoDto
 * @property {number} id - Todo ID
 * @property {string} title - Todo 제목
 * @property {string} [description] - Todo 설명
 * @property {boolean} done - 완료 여부
 * @property {string} [createdAt] - 생성 시간
 * @property {string} [updatedAt] - 수정 시간
 */

/**
 * @typedef {Object} PageTodoDto
 * @property {TodoDto[]} content - Todo 목록
 * @property {number} number - 현재 페이지 번호 (0부터 시작)
 * @property {number} size - 페이지 크기
 * @property {number} totalElements - 총 요소 개수
 * @property {number} totalPages - 총 페이지 개수
 * @property {boolean} first - 첫 번째 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 * @property {boolean} empty - 비어있는 페이지 여부
 */

/**
 * @typedef {Object} CreateTodoRequest
 * @property {string} title - Todo 제목
 * @property {string} [description] - Todo 설명
 */

/**
 * @typedef {Object} UpdateTodoRequest
 * @property {string} [title] - Todo 제목
 * @property {string} [description] - Todo 설명
 * @property {boolean} [done] - 완료 여부
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
	/**
	 * Todo 목록 조회
	 * @param {string} memberId - 멤버 ID
	 * @param {Object} [options={}] - 옵션
	 * @param {boolean} [options.done] - 완료 여부 필터
	 * @param {number} [options.page] - 페이지 번호
	 * @param {number} [options.size] - 페이지 크기
	 * @param {string} [options.sort] - 정렬 옵션
	 * @returns {Promise<{data: PageTodoDto|null, error: any}>}
	 */
	async function getTodos(memberId, options = {}) {
		const url = new URL(`${apiUrl}/api/members/${memberId}/todos`);
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
				const error = await response.text();
				return { data: null, error };
			}

			/** @type {PageTodoDto} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 특정 Todo 조회
	 * @param {string} memberId - 멤버 ID
	 * @param {number} todoId - Todo ID
	 * @returns {Promise<{data: TodoDto|null, error: any}>}
	 */
	async function getTodo(memberId, todoId) {
		try {
			const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos/${todoId}`, {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.text();
				return { data: null, error };
			}

			/** @type {TodoDto} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * Todo 생성
	 * @param {string} memberId - 멤버 ID
	 * @param {CreateTodoRequest} todo - Todo 생성 데이터
	 * @returns {Promise<{error: any}>}
	 */
	async function createTodo(memberId, todo) {
		try {
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
		} catch (error) {
			return { error };
		}
	}

	/**
	 * Todo 수정
	 * @param {string} memberId - 멤버 ID
	 * @param {number} todoId - Todo ID
	 * @param {UpdateTodoRequest} todo - Todo 수정 데이터
	 * @returns {Promise<{error: any}>}
	 */
	async function updateTodo(memberId, todoId, todo) {
		try {
			const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos/${todoId}`, {
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
	 * Todo 삭제
	 * @param {string} memberId - 멤버 ID
	 * @param {number} todoId - Todo ID
	 * @returns {Promise<{error: any}>}
	 */
	async function deleteTodo(memberId, todoId) {
		try {
			const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos/${todoId}`, {
				method: 'DELETE',
				credentials: 'include'
			});

			if (response.status !== 204) {
				const error = await response.json().catch(() => ({ message: 'Failed to delete todo' }));
				return { error };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	// 레거시 호환성을 위한 alias 메서드들
	async function createTodoForMember(memberId, todo) {
		return createTodo(memberId, todo);
	}

	return {
		getTodos,
		getTodo,
		createTodo,
		createTodoForMember,
		updateTodo,
		deleteTodo
	};
}
