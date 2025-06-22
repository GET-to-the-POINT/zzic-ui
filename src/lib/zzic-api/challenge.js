/**
 * @typedef {import('./types.js').ChallengeDto} ChallengeDto
 * @typedef {import('./types.js').ChallengeDetailDto} ChallengeDetailDto
 * @typedef {import('./types.js').ParticipantDto} ParticipantDto
 * @typedef {import('./types.js').ChallengeTodoResponse} ChallengeTodoResponse
 * @typedef {import('./types.js').PageResponse} PageResponse
 * @typedef {import('./types.js').PageChallengeDto} PageChallengeDto
 * @typedef {import('./types.js').PageChallengeDetailDto} PageChallengeDetailDto
 * @typedef {import('./types.js').PageChallengeTodoResponse} PageChallengeTodoResponse
 * @typedef {import('./types.js').CreateChallengeCommand} CreateChallengeCommand
 * @typedef {import('./types.js').UpdateChallengeCommand} UpdateChallengeCommand
 * @typedef {import('./types.js').CreateChallengeResponse} CreateChallengeResponse
 * @typedef {import('./types.js').ApiResponse} ApiResponse
 * @typedef {import('./types.js').ApiError} ApiError
 */

/**
 * 챌린지 클라이언트 팩토리 함수
 * @param {string} apiUrl - API 서버 URL
 * @param {Function} fetchFn - fetch 함수
 * @returns {Object} 클라이언트 객체
 */
export function createChallengeClient(apiUrl, fetchFn) {
	/**
	 * 모든 챌린지 조회 (페이징 지원)
	 * @param {Object} [options] - 조회 옵션
	 * @param {number} [options.page=0] - 페이지 번호
	 * @param {number} [options.size=10] - 페이지 크기
	 * @param {string} [options.sort='id,desc'] - 정렬 조건
	 * @param {string} [options.enroll] - 참여 옵션 (예: 'participants')
	 * @returns {Promise<{data: PageChallengeDto|null, error: ApiError|null}>}
	 */
	async function getChallenges(key = {}, options = {}) {
		const params = new URLSearchParams();

		Object.entries(options).forEach(([k, v]) => {
			if (v !== undefined && v !== null) {
				params.append(k, v.toString());
			}
		});

		// 나중에 join필드가 엔롤로 바뀌면 지우기
		if (options.enroll !== undefined) {
			params.append('join', options.enroll);
		}

		const url = new URL(apiUrl);
		url.pathname = '/challenges';
		url.search = params.toString();

		try {
			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
				return { data: null, error };
			}

			/** @type {PageChallengeDto} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 챌린지 상세 조회
	 * @param {number} challengeId - 챌린지 ID
	 * @returns {Promise<{data: ChallengeDto|null, error: ApiError|null}>}
	 */
	async function getChallenge(challengeId) {
		try {
			const url = new URL(`${apiUrl}/challenges/${challengeId}`);
			const response = await fetchFn(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				return {
					data: null,
					error: { status: response.status, message: response.statusText }
				};
			}

			/** @type {ChallengeDto} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 모든 챌린지와 참여자 조회 (페이징 지원)
	 * @param {Object} [options] - 조회 옵션
	 * @param {number} [options.page=0] - 페이지 번호
	 * @param {number} [options.size=10] - 페이지 크기
	 * @param {string} [options.sort='id,desc'] - 정렬 조건
	 * @returns {Promise<{data: PageChallengeDetailDto|null, error: any}>}
	 */
	async function getChallengesWithParticipants(options = {}) {
		const { page = 0, size = 10, sort = 'id,desc' } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			sort
		});

		try {
			const response = await fetchFn(`${apiUrl}/challenges/with-participants?${params}`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
			}

			/** @type {PageChallengeDetailDto} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 현재 기간 챌린지 투두 조회
	 * @param {Object} [options] - 조회 옵션
	 * @param {number} [options.page=0] - 페이지 번호
	 * @param {number} [options.size=10] - 페이지 크기
	 * @param {string} [options.sort='id,desc'] - 정렬 조건
	 * @returns {Promise<{data: PageChallengeTodoResponse|null, error: any}>}
	 */
	async function getChallengeTodos(options = {}) {
		const { page = 0, size = 10, sort = 'id,desc' } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			sort
		});

		try {
			const response = await fetchFn(`${apiUrl}/challenge-todos?${params}`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
			}

			/** @type {PageChallengeTodoResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 현재 기간 미완료 챌린지 투두 조회
	 * @param {Object} [options] - 조회 옵션
	 * @param {number} [options.page=0] - 페이지 번호
	 * @param {number} [options.size=10] - 페이지 크기
	 * @param {string} [options.sort='id,desc'] - 정렬 조건
	 * @returns {Promise<{data: PageChallengeTodoResponse|null, error: any}>}
	 */
	async function getUncompletedChallengeTodos(options = {}) {
		const { page = 0, size = 10, sort = 'id,desc' } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			sort
		});

		try {
			const response = await fetchFn(`${apiUrl}/challenge-todos/uncompleted?${params}`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
			}

			/** @type {PageChallengeTodoResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 완료된 챌린지 투두 조회
	 * @param {Object} [options] - 조회 옵션
	 * @param {number} [options.page=0] - 페이지 번호
	 * @param {number} [options.size=10] - 페이지 크기
	 * @param {string} [options.sort='id,desc'] - 정렬 조건
	 * @returns {Promise<{data: PageChallengeTodoResponse|null, error: any}>}
	 */
	async function getCompletedChallengeTodos(options = {}) {
		const { page = 0, size = 10, sort = 'id,desc' } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			sort
		});

		try {
			const response = await fetchFn(`${apiUrl}/challenge-todos/completed?${params}`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
			}

			/** @type {PageChallengeTodoResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 챌린지 완료 처리
	 * @param {string} challengeId - 챌린지 ID
	 * @returns {Promise<{error: any}>}
	 */
	async function completeChallenge(challengeId) {
		try {
			const response = await fetchFn(`${apiUrl}/challenge-todos/${challengeId}/complete`, {
				method: 'POST',
				credentials: 'include'
			});

			if (!response.ok) {
				return { error: { status: response.status, message: response.statusText } };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	/**
	 * 챌린지 완료 취소
	 * @param {number} challengeId - 챌린지 ID
	 * @returns {Promise<{error: any}>}
	 */
	async function cancelCompleteChallenge(challengeId) {
		try {
			const response = await fetchFn(`${apiUrl}/challenge-todos/${challengeId}/complete`, {
				method: 'DELETE',
				credentials: 'include'
			});

			if (!response.ok) {
				return { error: { status: response.status, message: response.statusText } };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	/**
	 * 챌린지 등록/해지 (통합 메서드)
	 * @param {Object} params - 챌린지 파라미터
	 * @param {number} params.challengeId - 챌린지 ID
	 * @param {Object} options - 등록 옵션
	 * @param {boolean} options.enroll - true: 등록, false: 해지
	 * @returns {Promise<{error: any}>}
	 */
	async function enroll({ challengeId }, { enroll }) {
		const endpoint = enroll
			? `${apiUrl}/challenge-participations/${challengeId}/join`
			: `${apiUrl}/challenge-participations/${challengeId}/leave`;

		const method = enroll ? 'POST' : 'DELETE';

		try {
			const response = await fetchFn(endpoint, {
				method,
				credentials: 'include'
			});

			if (!response.ok) {
				return { error: { status: response.status, message: response.statusText } };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	/**
	 * 챌린지 생성
	 * @param {CreateChallengeCommand} challenge - 챌린지 생성 데이터
	 * @returns {Promise<{data: CreateChallengeResponse|null, error: any}>}
	 */
	async function createChallenge(challenge) {
		try {
			const response = await fetchFn(`${apiUrl}/challenges`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(challenge),
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
			}

			/** @type {CreateChallengeResponse} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 챌린지 수정
	 * @param {number} challengeId - 챌린지 ID
	 * @param {UpdateChallengeCommand} challenge - 챌린지 수정 데이터
	 * @returns {Promise<{error: any}>}
	 */
	async function updateChallenge(challengeId, challenge) {
		try {
			const response = await fetchFn(`${apiUrl}/challenges/${challengeId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(challenge),
				credentials: 'include'
			});

			if (!response.ok) {
				return { error: { status: response.status, message: response.statusText } };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	/**
	 * 챌린지 삭제
	 * @param {number} challengeId - 챌린지 ID
	 * @returns {Promise<{error: any}>}
	 */
	async function deleteChallenge(challengeId) {
		try {
			const response = await fetchFn(`${apiUrl}/challenges/${challengeId}`, {
				method: 'DELETE',
				credentials: 'include'
			});

			if (!response.ok) {
				return { error: { status: response.status, message: response.statusText } };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	return {
		getChallenges,
		getChallenge,
		getChallengesWithParticipants,
		getChallengeTodos,
		getUncompletedChallengeTodos,
		getCompletedChallengeTodos,
		completeChallenge,
		cancelCompleteChallenge,
		enroll,
		createChallenge,
		updateChallenge,
		deleteChallenge
	};
}
