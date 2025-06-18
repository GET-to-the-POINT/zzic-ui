/**
 * Category 도메인 타입 정의
 */

/**
 * @typedef {Object} CategoryResponse
 * @property {number} id - 카테고리 ID
 * @property {string} name - 카테고리명
 */

/**
 * @typedef {Object} PageCategoryResponse
 * @property {number} totalElements - 전체 요소 수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 * @property {number} size - 페이지 크기
 * @property {CategoryResponse[]} content - 카테고리 목록
 * @property {number} number - 현재 페이지 번호
 * @property {number} numberOfElements - 현재 페이지 요소 수
 * @property {boolean} empty - 빈 페이지 여부
 */

/**
 * @typedef {Object} CreateCategoryRequest
 * @property {string} name - 카테고리명
 */

/**
 * @typedef {Object} UpdateCategoryRequest
 * @property {string} name - 카테고리명
 */

/**
 * @typedef {Object} ApiError
 * @property {number} [status] - HTTP 상태 코드
 * @property {string} [message] - 에러 메시지
 */

/**
 * 카테고리 클라이언트 팩토리 함수
 * @param {string} apiUrl - API 서버 URL
 * @param {Function} fetchFn - fetch 함수
 * @returns {Object} 클라이언트 객체
 */
export function createCategoryClient(apiUrl, fetchFn) {
	/**
	 * 카테고리 목록 조회
	 * @param {Object} [options={}] - 옵션
	 * @param {number} [options.page] - 페이지 번호
	 * @param {number} [options.size] - 페이지 크기
	 * @param {string} [options.sort] - 정렬 옵션
	 * @returns {Promise<{data: PageCategoryResponse|null, error: ApiError|null}>}
	 */
	async function getCategories(options = {}) {
		const url = new URL(`${apiUrl}/categories`);
		
		// 타입 안전성을 위해 명시적으로 처리
		if (options.page != null) {
			url.searchParams.append('page', String(options.page));
		}
		if (options.size != null) {
			url.searchParams.append('size', String(options.size));
		}
		if (options.sort != null) {
			url.searchParams.append('sort', String(options.sort));
		}

		try {
			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
				return { data: null, error };
			}

			/** @type {PageCategoryResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {ApiError} */ (error) };
		}
	}

	/**
	 * 특정 카테고리 조회
	 * @param {number} categoryId - 카테고리 ID
	 * @returns {Promise<{data: CategoryResponse|null, error: ApiError|null}>}
	 */
	async function getCategory(categoryId) {
		try {
			const url = new URL(`${apiUrl}/categories/${categoryId}`);
			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.text();
				return { data: null, error: /** @type {ApiError} */ ({ message: error }) };
			}

			/** @type {CategoryResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {ApiError} */ (error) };
		}
	}

	/**
	 * 카테고리 생성
	 * @param {CreateCategoryRequest} category - 카테고리 생성 데이터
	 * @returns {Promise<{data: CategoryResponse|null, error: ApiError|null}>}
	 */
	async function createCategory(category) {
		try {
			const url = new URL(`${apiUrl}/categories`);
			const response = await fetchFn(url.toString(), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(category),
				credentials: 'include'
			});

			if (response.status !== 201) {
				const error = await response.json().catch(() => ({ message: 'Failed to create category' }));
				return { data: null, error: /** @type {ApiError} */ (error) };
			}

			/** @type {CategoryResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {ApiError} */ (error) };
		}
	}

	/**
	 * 카테고리 수정
	 * @param {number} categoryId - 카테고리 ID
	 * @param {UpdateCategoryRequest} category - 카테고리 수정 데이터
	 * @returns {Promise<{data: CategoryResponse|null, error: ApiError|null}>}
	 */
	async function updateCategory(categoryId, category) {
		try {
			const url = new URL(`${apiUrl}/categories/${categoryId}`);
			const response = await fetchFn(url.toString(), {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(category),
				credentials: 'include'
			});

			if (response.status !== 200) {
				const error = await response.json().catch(() => ({ message: 'Failed to update category' }));
				return { data: null, error: /** @type {ApiError} */ (error) };
			}

			/** @type {CategoryResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error: /** @type {ApiError} */ (error) };
		}
	}

	/**
	 * 카테고리 삭제
	 * @param {number} categoryId - 카테고리 ID
	 * @returns {Promise<{error: ApiError|null}>}
	 */
	async function deleteCategory(categoryId) {
		try {
			const url = new URL(`${apiUrl}/categories/${categoryId}`);
			const response = await fetchFn(url.toString(), {
				method: 'DELETE',
				credentials: 'include'
			});

			if (response.status !== 204) {
				const error = await response.json();
				return { error: /** @type {ApiError} */ (error) };
			}

			return { error: null };
		} catch (error) {
			return { error: /** @type {ApiError} */ (error) };
		}
	}

	return {
		getCategories,
		getCategory,
		createCategory,
		updateCategory,
		deleteCategory
	};
}
