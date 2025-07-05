/**
 * @typedef {Object} Friend
 * @property {number} id - 친구 관계 ID
 * @property {number} memberId - 친구의 멤버 ID
 * @property {string} nickname - 친구의 닉네임
 * @property {string} [profilePictureUrl] - 친구의 프로필 사진 URL
 * @property {string} [introduction] - 친구의 소개글
 * @property {number} level - 친구의 레벨
 * @property {string} levelName - 친구의 레벨명
 * @property {string} status - 친구 상태 (accepted, pending, blocked)
 * @property {string} createdAt - 친구 관계 생성일
 */

/**
 * @typedef {Object} FriendRequest
 * @property {number} id - 친구 요청 ID
 * @property {number} fromMemberId - 요청 보낸 사람 ID
 * @property {string} fromNickname - 요청 보낸 사람 닉네임
 * @property {string} [fromProfilePictureUrl] - 요청 보낸 사람 프로필 사진
 * @property {number} toMemberId - 요청 받은 사람 ID
 * @property {string} toNickname - 요청 받은 사람 닉네임
 * @property {string} [message] - 친구 요청 메시지
 * @property {string} status - 요청 상태 (pending, accepted, rejected)
 * @property {string} createdAt - 요청 생성일
 */

/**
 * @typedef {Object} FriendInvite
 * @property {string} inviteCode - 초대 코드
 * @property {string} expiresAt - 만료 시간
 * @property {boolean} isUsed - 사용 여부
 * @property {string} createdAt - 생성일
 */

/**
 * 친구 관련 API 클라이언트 생성
 * @param {string} apiUrl - API URL
 * @param {Function} fetchFn - fetch 함수
 * @returns {Object} 친구 API 메서드들
 */
export function createFriendsClient(apiUrl, fetchFn) {
	return {
		/**
		 * 친구 목록 조회
		 * @param {Object} params - 조회 파라미터
		 * @param {string} [params.status] - 친구 상태 필터 (accepted, pending, blocked)
		 * @param {number} [params.limit] - 조회 개수
		 * @param {number} [params.offset] - 오프셋
		 * @returns {Promise<{data: Friend[], error: Error|null}>}
		 */
		async getList({ status = 'accepted', limit = 20, offset = 0 } = {}) {
			const queryParams = new URLSearchParams({
				status,
				limit: limit.toString(),
				offset: offset.toString()
			});

			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends?${queryParams}`, {
					method: 'GET',
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response.json().catch(() => ({ message: 'Failed to get friends' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 받은 친구 요청 목록 조회
		 * @returns {Promise<{data: FriendRequest[], error: Error|null}>}
		 */
		async getReceivedRequests() {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/requests/received`, {
					method: 'GET',
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response
						.json()
						.catch(() => ({ message: 'Failed to get received requests' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 보낸 친구 요청 목록 조회
		 * @returns {Promise<{data: FriendRequest[], error: Error|null}>}
		 */
		async getSentRequests() {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/requests/sent`, {
					method: 'GET',
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response
						.json()
						.catch(() => ({ message: 'Failed to get sent requests' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 친구 검색
		 * @param {string} query - 검색어 (닉네임 또는 이메일)
		 * @returns {Promise<{data: Array, error: Error|null}>}
		 */
		async search(query) {
			try {
				const queryParams = new URLSearchParams({ q: query });
				const response = await fetchFn(`${apiUrl}/v1/members/search?${queryParams}`, {
					method: 'GET',
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response
						.json()
						.catch(() => ({ message: 'Failed to search members' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 친구 요청 보내기
		 * @param {number} targetMemberId - 대상 멤버 ID
		 * @param {string} [message] - 친구 요청 메시지
		 * @returns {Promise<{data: FriendRequest, error: Error|null}>}
		 */
		async sendRequest(targetMemberId, message = '') {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/requests`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						targetMemberId,
						message
					}),
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response
						.json()
						.catch(() => ({ message: 'Failed to send friend request' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 친구 요청 수락
		 * @param {number} requestId - 친구 요청 ID
		 * @returns {Promise<{data: Friend, error: Error|null}>}
		 */
		async acceptRequest(requestId) {
			try {
				const response = await fetchFn(
					`${apiUrl}/v1/members/friends/requests/${requestId}/accept`,
					{
						method: 'POST',
						credentials: 'include'
					}
				);

				if (!response.ok) {
					const error = await response
						.json()
						.catch(() => ({ message: 'Failed to accept friend request' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 친구 요청 거절
		 * @param {number} requestId - 친구 요청 ID
		 * @returns {Promise<{data: boolean, error: Error|null}>}
		 */
		async rejectRequest(requestId) {
			try {
				const response = await fetchFn(
					`${apiUrl}/v1/members/friends/requests/${requestId}/reject`,
					{
						method: 'POST',
						credentials: 'include'
					}
				);

				if (!response.ok) {
					const error = await response
						.json()
						.catch(() => ({ message: 'Failed to reject friend request' }));
					return { data: null, error };
				}

				return { data: true, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 친구 삭제
		 * @param {number} friendId - 친구 관계 ID
		 * @returns {Promise<{data: boolean, error: Error|null}>}
		 */
		async remove(friendId) {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/${friendId}`, {
					method: 'DELETE',
					credentials: 'include'
				});

				if (response.status !== 204) {
					const error = await response.json().catch(() => ({ message: 'Failed to remove friend' }));
					return { data: null, error };
				}

				return { data: true, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 친구 차단
		 * @param {number} friendId - 친구 관계 ID
		 * @returns {Promise<{data: boolean, error: Error|null}>}
		 */
		async block(friendId) {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/${friendId}/block`, {
					method: 'POST',
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response.json().catch(() => ({ message: 'Failed to block friend' }));
					return { data: null, error };
				}

				return { data: true, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 친구 차단 해제
		 * @param {number} friendId - 친구 관계 ID
		 * @returns {Promise<{data: boolean, error: Error|null}>}
		 */
		async unblock(friendId) {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/${friendId}/unblock`, {
					method: 'POST',
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response
						.json()
						.catch(() => ({ message: 'Failed to unblock friend' }));
					return { data: null, error };
				}

				return { data: true, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 초대 코드 생성
		 * @returns {Promise<{data: FriendInvite, error: Error|null}>}
		 */
		async createInvite() {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/invites`, {
					method: 'POST',
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response.json().catch(() => ({ message: 'Failed to create invite' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 초대 코드로 친구 추가
		 * @param {string} inviteCode - 초대 코드
		 * @returns {Promise<{data: Friend, error: Error|null}>}
		 */
		async acceptInvite(inviteCode) {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/invites/accept`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ inviteCode }),
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response.json().catch(() => ({ message: 'Failed to accept invite' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},

		/**
		 * 내 초대 코드 목록 조회
		 * @returns {Promise<{data: FriendInvite[], error: Error|null}>}
		 */
		async getMyInvites() {
			try {
				const response = await fetchFn(`${apiUrl}/v1/members/friends/invites`, {
					method: 'GET',
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response.json().catch(() => ({ message: 'Failed to get invites' }));
					return { data: null, error };
				}

				const data = await response.json();
				return { data, error: null };
			} catch (error) {
				return { data: null, error };
			}
		}
	};
}
