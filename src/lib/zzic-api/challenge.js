/**
 * @typedef {Object} ChallengeDto
 * @property {number} id - 챌린지 ID
 * @property {string} title - 챌린지 제목
 * @property {string} description - 챌린지 설명
 * @property {string} startDate - 시작일 (YYYY-MM-DD)
 * @property {string} endDate - 종료일 (YYYY-MM-DD)
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 */

/**
 * @typedef {Object} ChallengeJoinedDto
 * @property {number} id - 챌린지 ID
 * @property {string} title - 챌린지 제목
 * @property {string} description - 챌린지 설명
 * @property {string} startDate - 시작일 (YYYY-MM-DD)
 * @property {string} endDate - 종료일 (YYYY-MM-DD)
 * @property {'DAILY'|'WEEKLY'|'MONTHLY'} periodType - 기간 타입
 * @property {boolean} participationStatus - 참여 상태
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
	 * 모든 챌린지 조회
	 * @returns {Promise<{data: ChallengeDto[]|null, error: any}>}
	 */
	async function getChallenges() {
		try {
			const response = await fetchFn(`${apiUrl}/challenges`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
			}

			/** @type {ChallengeDto[]} */
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
	 * 사용자별 챌린지 조회 (참여 여부 포함)
	 * @returns {Promise<{data: ChallengeJoinedDto[]|null, error: any}>}
	 */
	async function getChallengesByMember() {
		try {
			const response = await fetchFn(`${apiUrl}/challenges/by-member`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: null, error: { status: response.status, message: response.statusText } };
			}

			/** @type {ChallengeJoinedDto[]} */
			const data = await response.json();
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 챌린지 참여
	 * @param {number} challengeId - 챌린지 ID
	 * @returns {Promise<{error: any}>}
	 */
	async function joinChallenge(challengeId) {
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
	async function leaveChallenge(challengeId) {
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
		getChallengesByMember,
		joinChallenge,
		leaveChallenge,
		createChallenge,
		updateChallenge,
		deleteChallenge
	};
}
