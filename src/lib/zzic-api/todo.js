/**
 * @typedef {import('./types.js').TodoDto} TodoDto
 * @typedef {import('./types.js').PageTodoDto} PageTodoDto
 * @typedef {import('./types.js').CreateTodoRequest} CreateTodoRequest
 * @typedef {import('./types.js').UpdateTodoRequest} UpdateTodoRequest
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
	 * @param {boolean} [options.done] - 완료 여부 필터
	 * @param {number} [options.page] - 페이지 번호
	 * @param {number} [options.size] - 페이지 크기
	 * @param {string} [options.sort] - 정렬 옵션
	 * @returns {Promise<{data: PageTodoDto|null, error: ApiError|null}>}
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
				const error = await response.json();
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
	 * 특정 할 일 조회
	 * @param {string} memberId - 멤버 ID
	 * @param {number} todoId - 할 일 ID
	 * @returns {Promise<{data: TodoDto|null, error: ApiError|null}>}
	 */
	async function getTodo(memberId, todoId) {
		try {
			const url = new URL(`${apiUrl}/api/members/${memberId}/todos/${todoId}`);
			const response = await fetchFn(url.toString(), {
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
	 * 할 일 생성
	 * @param {string} memberId - 멤버 ID
	 * @param {CreateTodoRequest} todo - 할 일 생성 데이터
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function createTodo(memberId, todo) {
		try {
			const url = new URL(`${apiUrl}/api/members/${memberId}/todos`);
			const response = await fetchFn(url.toString(), {
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
	 * @param {string} memberId - 멤버 ID
	 * @param {number} todoId - 할 일 ID
	 * @param {UpdateTodoRequest} todo - 할 일 수정 데이터
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function updateTodo(memberId, todoId, todo) {
		try {
			const url = new URL(`${apiUrl}/api/members/${memberId}/todos/${todoId}`);
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
	 * @param {string} memberId - 멤버 ID
	 * @param {number} todoId - 할 일 ID
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function deleteTodo(memberId, todoId) {
		try {
			const url = new URL(`${apiUrl}/api/members/${memberId}/todos/${todoId}`);
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
		deleteTodo
	};
}
