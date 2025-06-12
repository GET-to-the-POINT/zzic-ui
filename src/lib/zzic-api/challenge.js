/**
 * @typedef {Object} ChallengeDto
 * @property {number} id - 챌린지 ID
 * @property {string} title - 챌린지 제목
 * @property {string} description - 챌린지 설명
 * @property {string} startDate - 시작일 (YYYY-MM-DD)
 * @property {string} endDate - 종료일 (YYYY-MM-DD)
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 * @property {boolean} [participationStatus] - 참여 상태 (인증된 사용자의 경우)
 */

/**
 * @typedef {Object} ChallengeDetailDto
 * @property {number} id - 챌린지 ID
 * @property {string} title - 챌린지 제목
 * @property {string} description - 챌린지 설명
 * @property {string} startDate - 시작일 (YYYY-MM-DD)
 * @property {string} endDate - 종료일 (YYYY-MM-DD)
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 * @property {ParticipantDto[]} participants - 참여자 목록
 */

/**
 * @typedef {Object} ParticipantDto
 * @property {string} id - 참여자 ID (UUID)
 * @property {string} email - 참여자 이메일
 * @property {string} nickname - 참여자 닉네임
 * @property {string} joinedAt - 참여일 (ISO 8601)
 */

/**
 * @typedef {Object} ChallengeTodoResponse
 * @property {number} id - 챌린지 투두 ID
 * @property {string} challengeTitle - 챌린지 제목
 * @property {string} challengeDescription - 챌린지 설명
 * @property {string} startDate - 시작일 (YYYY-MM-DD)
 * @property {string} endDate - 종료일 (YYYY-MM-DD)
 * @property {boolean} done - 완료 여부
 * @property {boolean} isPersisted - 영속성 여부
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 */

/**
 * @typedef {Object} PageResponse
 * @property {number} totalElements - 전체 요소 수
 * @property {number} totalPages - 전체 페이지 수
 * @property {boolean} first - 첫 페이지 여부
 * @property {boolean} last - 마지막 페이지 여부
 * @property {number} size - 페이지 크기
 * @property {number} number - 현재 페이지 번호
 * @property {number} numberOfElements - 현재 페이지 요소 수
 * @property {boolean} empty - 빈 페이지 여부
 */

/**
 * @typedef {PageResponse & {content: ChallengeDto[]}} PageChallengeDto
 */

/**
 * @typedef {PageResponse & {content: ChallengeDetailDto[]}} PageChallengeDetailDto
 */

/**
 * @typedef {PageResponse & {content: ChallengeTodoResponse[]}} PageChallengeTodoResponse
 */

/**
 * @typedef {Object} CreateChallengeCommand
 * @property {string} title - 챌린지 제목
 * @property {string} description - 챌린지 설명
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 */

/**
 * @typedef {Object} UpdateChallengeCommand
 * @property {string} [title] - 챌린지 제목
 * @property {string} [description] - 챌린지 설명
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} [periodType] - 기간 타입
 */

/**
 * @typedef {Object} CreateChallengeResponse
 * @property {number} challengeId - 생성된 챌린지 ID
 * @property {string} message - 응답 메시지
 */

/**
 * @typedef {Object} ApiResponse
 * @property {any} data - 응답 데이터
 * @property {Object|null} error - 에러 정보
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
	 * @returns {Promise<{data: PageChallengeDto|null, error: any}>}
	 */
	async function getChallenges(options = {}) {
		const { page = 0, size = 10, sort = 'id,desc' } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
			sort
		});

		try {
			const response = await fetchFn(`${apiUrl}/challenges?${params}`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
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
	 * @returns {Promise<{data: ChallengeDto|null, error: any}>}
	 */
	async function getChallenge(challengeId) {
		try {
			const response = await fetchFn(`${apiUrl}/challenges/${challengeId}`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
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
	 * @param {number} challengeId - 챌린지 ID
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
	 * 챌린지 참여
	 * @param {number} challengeId - 챌린지 ID
	 * @returns {Promise<{error: any}>}
	 */
	async function join(challengeId) {
		try {
			const response = await fetchFn(`${apiUrl}/challenge-participations/${challengeId}/join`, {
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
	 * 챌린지 탈퇴
	 * @param {number} challengeId - 챌린지 ID
	 * @returns {Promise<{error: any}>}
	 */
	async function leave(challengeId) {
		try {
			const response = await fetchFn(`${apiUrl}/challenge-participations/${challengeId}/leave`, {
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
		join,
		leave,
		createChallenge,
		updateChallenge,
		deleteChallenge
	};
}
