/**
 * 반복 타입 API 클라이언트
 * @param {string} apiUrl - API 서버 URL
 * @param {Function} fetchFn - Fetch 함수
 * @returns {Object} 반복 타입 API 클라이언트 객체
 */
export function createRepeatClient(apiUrl, fetchFn) {
	const baseUrl = `${apiUrl}/repeat-types`;

	return {
		/**
		 * 반복 타입 목록 조회
		 * @returns {Promise<Object>} 반복 타입 목록 응답
		 */
		async getRepeatTypes() {
			try {
				const response = await fetchFn(baseUrl, {
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
				console.error('반복 타입 목록 조회 실패:', error);
				return {
					data: null,
					error: { message: error instanceof Error ? error.message : String(error) }
				};
			}
		}
	};
}