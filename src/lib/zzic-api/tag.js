/**
 * 태그 API 클라이언트
 * @param {string} apiUrl - API 서버 URL
 * @param {Function} fetchFn - Fetch 함수
 * @returns {Object} 태그 API 클라이언트 객체
 */
export function createTagClient(apiUrl, fetchFn) {
	const baseUrl = `${apiUrl}/tags`;

	return {
		/**
		 * 태그 목록 조회
		 * @param {Object} [options={}] - 조회 옵션
		 * @param {number[]} [options.categoryIds] - 카테고리 ID 목록 (중복 허용)
		 * @param {number} [options.page=0] - 페이지 번호 (0부터 시작)
		 * @param {number} [options.size=10] - 페이지 크기
		 * @param {string} [options.direction='asc'] - 정렬 방향 (asc: 오름차순, desc: 내림차순)
		 * @returns {Promise<Object>} 태그 목록 응답
		 */
		async getTags(options = {}) {
			const { categoryIds, page = 0, size = 100, direction = 'asc' } = options;
			
			const params = new URLSearchParams({
				page: String(page),
				size: String(size),
				direction
			});

			// categoryIds 배열 파라미터 처리
			if (categoryIds && Array.isArray(categoryIds)) {
				categoryIds.forEach(id => params.append('categoryIds', String(id)));
			}

			try {
				const response = await fetchFn(`${baseUrl}?${params}`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				console.error('태그 목록 조회 실패:', error);
				return { data: null, error: { message: error instanceof Error ? error.message : String(error) } };
			}
		}
	};
}
