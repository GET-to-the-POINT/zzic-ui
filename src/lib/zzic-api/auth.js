/**
 * @typedef {import('./types.js').SignInRequest} SignInRequest
 * @typedef {import('./types.js').SignUpRequest} SignUpRequest
 * @typedef {import('./types.js').MemberMeResponse} MemberMeResponse
 * @typedef {import('./types.js').AuthResponse} AuthResponse
 * @typedef {import('./types.js').ApiError} ApiError
 */

/**
 * 인증 클라이언트 팩토리
 * @param {string} apiUrl - API 서버 URL
 * @param {Function} fetchFn - fetch 함수
 * @param {Object} [options={}] - 추가 옵션
 * @param {Function} [options.getUserFn] - 사용자 정보 가져오기 함수
 * @returns {Object} 인증 클라이언트
 */
export function createAuthClient(apiUrl, fetchFn, options = {}) {
	const { getUserFn } = options;

	/**
	 * 현재 사용자 정보 가져오기
	 * @returns {Promise<{data: {user: MemberMeResponse|null}, error: any}>}
	 */
	async function getUser() {
		if (getUserFn) {
			return getUserFn();
		}
		
		try {
			const response = await fetchFn(`${apiUrl}/auth/me`, {
				credentials: 'include'
			});

			if (!response.ok) {
				return { data: { user: null }, error: { message: 'User not authenticated' } };
			}

			const user = await response.json();
			return { data: { user }, error: null };
		} catch (error) {
			return { data: { user: null }, error };
		}
	}

	/**
	 * 로그인
	 * @param {SignInRequest} credentials - 로그인 자격 증명
	 * @returns {Promise<{data: {user: MemberMeResponse|null}, error: any}>}
	 */
	async function signIn(credentials) {
		try {
			const response = await fetchFn(`${apiUrl}/auth/sign-in`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
				return { data: null, error };
			}

			// 로그인 성공 후 사용자 정보 가져오기
			const { data, error: getUserError } = await getUser();
			if (getUserError) {
				return {data: null, error: getUserError}
			}

			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	/**
	 * 회원가입
	 * @param {SignUpRequest} credentials - 회원가입 자격 증명
	 * @returns {Promise<{error: any}>}
	 */
	async function signUp(credentials) {
		try {
			const response = await fetchFn(`${apiUrl}/auth/sign-up`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.json();
				return { error };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	/**
	 * 로그아웃
	 * @returns {Promise<{error: any}>}
	 */
	async function signOut() {
		try {
			const response = await fetchFn(`${apiUrl}/auth/sign-out`, {
				method: 'POST',
				credentials: 'include'
			});

			if (!response.ok) {
				const error = await response.text();
				return { error };
			}

			return { error: null };
		} catch (error) {
			return { error };
		}
	}

	return {
		getUser,
		signIn,
		signUp,
		signOut
	};
}