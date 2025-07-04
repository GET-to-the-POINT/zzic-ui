/**
 * @typedef {Object} MemberLevelResponse
 * @property {number} currentLevel - 현재 레벨
 * @property {string} levelName - 레벨명
 * @property {number} currentExp - 현재 보유 경험치
 * @property {number} currentLevelMinExp - 현재 레벨의 최소 필요 경험치
 * @property {number} expToNextLevel - 다음 레벨까지 필요한 경험치
 * @property {number} currentLevelProgress - 현재 레벨에서 획득한 경험치
 * @property {number} currentLevelTotal - 현재 레벨에서 필요한 총 경험치
 */

/**
 * @typedef {Object} MemberResponse
 * @property {string} id - 회원 ID
 * @property {string} email - 회원 이메일
 * @property {string} nickname - 회원 닉네임
 * @property {string} introduction - 소개글
 * @property {string} timeZone - 사용자 타임존
 * @property {string} locale - 사용자 로케일
 */

/**
 * 회원 클라이언트 팩토리
 * @param {string} apiUrl - API 서버 URL
 * @param {Function} fetchFn - fetch 함수
 * @returns {Object} 회원 클라이언트
 */
export function createMemberClient(apiUrl, fetchFn) {
	/**
	 * 회원 레벨/경험치 정보 조회
	 * @param {Object} params - 파라미터 객체
	 * @param {string} params.memberId - 회원 ID
	 * @returns {Promise<{data: MemberLevelResponse|null, error: any}>}
	 */
	async function getMemberExperience({memberId}) {
		try {
			const response = await fetchFn(`${apiUrl}/members/${memberId}/experience`, {
				credentials: 'include',
			});

			if (!response.ok) {
                const error = await response.json();
				return {
					data: null,
					error
				};
			}

			const data = await response.json();
			return {
				data,
				error: null
			};
		} catch (error) {
			return {
				data: null,
				error: {
					status: 500,
					message: `회원 경험치 정보 조회 중 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
				}
			};
		}
	}

	/**
	 * 회원 상세 정보 조회
	 * @param {string} memberId - 회원 ID
	 * @returns {Promise<{data: MemberResponse|null, error: any}>}
	 */
	async function getMember(memberId) {
		try {
			const response = await fetchFn(`${apiUrl}/members/${memberId}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				return {
					data: null,
					error: {
						status: response.status,
						message: `회원 정보 조회 실패: ${response.statusText}`
					}
				};
			}

			const data = await response.json();
			return {
				data,
				error: null
			};
		} catch (error) {
			return {
				data: null,
				error: {
					status: 500,
					message: `회원 정보 조회 중 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
				}
			};
		}
	}

	/**
	 * 회원 정보 수정
	 * @param {string} memberId - 회원 ID
	 * @param {Object} updateData - 수정할 데이터
	 * @param {string} [updateData.nickname] - 회원 닉네임
	 * @param {string} [updateData.introduction] - 소개글
	 * @returns {Promise<{data: boolean, error: any}>}
	 */
	async function updateMember(memberId, updateData) {
		try {
			const formData = new FormData();
			
			if (updateData.nickname) {
				formData.append('nickname', updateData.nickname);
			}
			if (updateData.introduction) {
				formData.append('introduction', updateData.introduction);
			}

			const response = await fetchFn(`${apiUrl}/members/${memberId}`, {
				method: 'PATCH',
				credentials: 'include',
				body: formData
			});

			if (!response.ok) {
				return {
					data: false,
					error: {
						status: response.status,
						message: `회원 정보 수정 실패: ${response.statusText}`
					}
				};
			}

			return {
				data: true,
				error: null
			};
		} catch (error) {
			return {
				data: false,
				error: {
					status: 500,
					message: `회원 정보 수정 중 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
				}
			};
		}
	}

	return {
		getMemberExperience,
		getMember,
		updateMember
	};
}
