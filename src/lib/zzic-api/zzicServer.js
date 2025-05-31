import { getUserFromCookies } from '$lib/jwt.js';
import { createTodoClient } from './todo.js';

/**
 * @typedef {Object} SignInRequest
 * @property {string} email - 이메일 주소
 * @property {string} password - 비밀번호
 */

/**
 * @typedef {Object} SignUpRequest
 * @property {string} email - 이메일 주소
 * @property {string} password - 비밀번호
 * @property {string} nickname - 닉네임
 */

/**
 * @typedef {Object} MemberMeResponse
 * @property {string} email - 사용자의 이메일 주소
 * @property {string} nickname - 사용자의 닉네임
 */

/**
 * @typedef {Object} AuthResponse
 * @property {{user: MemberMeResponse|null}} data - 사용자 데이터
 * @property {Object|null} error - 에러 정보
 */

/**
 * 서버 사이드용 ZZIC 인증 클라이언트  
 * @param {string} apiUrl - API 서버 URL
 * @param {Object} options - 옵션 객체
 * @param {any} [options.global={}] - 글로벌 설정
 * @param {any} options.cookies - 쿠키 객체
 * @returns {Object} 서버 클라이언트 객체
 */
export function createZzicServerClient(apiUrl, options) {
	const { global = {}, cookies } = options;
	const fetchFn = /** @type {any} */ (global.fetch) || globalThis.fetch;

	// 할 일 팩토리 클라이언트 생성
	const todoClient = createTodoClient(apiUrl, fetchFn);

	const auth = {
		/**
		 * 현재 사용자 정보 가져오기
		 * @returns {Promise<AuthResponse>}
		 */
		async getUser() {
			let user = getUserFromCookies(/** @type {any} */ (cookies));

			if (!user) {
				return { data: { user: null }, error: { message: 'User not authenticated' } };
			}

			return { data: { user: /** @type {MemberMeResponse} */ (user) }, error: null };
		},

		/**
		 * 로그인
		 * @param {SignInRequest} credentials - 로그인 자격 증명
		 * @returns {Promise<AuthResponse>}
		 */
		async signIn(credentials) {
			try {
				const response = await fetchFn(`${apiUrl}/auth/sign-in`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(credentials)
				});

				if (!response.ok) {
					const error = /** @type {any} */ (await response.text());
					return { data: { user: null }, error };
				}

				// 서버에서 받은 Set-Cookie 헤더를 안전하게 처리
				try {
					const setCookieHeader = response.headers.get('set-cookie');
					if (setCookieHeader) {
						// 모든 쿠키 속성을 보존하며 파싱
						const cookieEntries = setCookieHeader
							.split(/,(?=\s*[^;=\s]+=)/) // handle multiple cookies, more robust for names with non-word chars
							.map(/** @param {any} cookie */ cookie => {
								const parts = cookie.trim().split(';').map(/** @param {any} p */ p => p.trim());
								const [name, value] = parts[0].split('=');
								if (!name || !value) return null;

								const options = {};
								for (let i = 1; i < parts.length; i++) {
									const [optKey, optVal] = parts[i].split('=');
									const key = optKey.toLowerCase();
									switch (key) {
										case 'path':
											options.path = optVal;
											break;
										case 'expires':
											options.expires = new Date(optVal);
											break;
										case 'max-age':
											options.maxAge = parseInt(optVal);
											break;
										case 'secure':
											options.secure = true;
											break;
										case 'httponly':
											options.httpOnly = true;
											break;
										case 'samesite':
											options.sameSite = optVal;
											break;
									}
									if (options.httpOnly === undefined) {
										options.httpOnly = false;
									}
								}

								return { name: name.trim(), value: value.trim(), options };
							})
							.filter(Boolean);
						/** @type {any} */ (cookies).setAll(cookieEntries);
					}
				} catch (cookieError) {
					console.warn('쿠키 설정 실패:', cookieError);
					// 쿠키 설정 실패해도 계속 진행
				}

				return { data: { user: null }, error: null };
			} catch (error) {
				return { data: { user: null }, error: /** @type {any} */ (error) };
			}
		},

		/**
		 * 회원가입
		 * @param {SignUpRequest} credentials - 회원가입 자격 증명
		 * @returns {Promise<{error: Object|null}>}
		 */
		async signUp(credentials) {
			try {
				const signUpResponse = await fetchFn(`${apiUrl}/auth/sign-up`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(credentials)
				});

				if (!signUpResponse.ok) {
					const error = /** @type {any} */ (await signUpResponse.json());
					return { error };
				}

				return { error: null };
			} catch (error) {
				return { error: /** @type {any} */ (error) };
			}
		},

		/**
		 * 로그아웃
		 * @returns {Promise<{error: Object|null}>}
		 */
		async signOut() {
			try {
				await fetchFn(`${apiUrl}/auth/sign-out`, {
					method: 'POST'
				});

				return { error: null };
			} catch (error) {
				console.error('서버 로그아웃 실패:', error);
				return { error: /** @type {any} */ (error) };
			}
		}
	};

	const todo = {
		/**
		 * 할 일 목록 조회
		 * @param {string} memberId - 멤버 ID
		 * @returns {Promise<{data: import('./todo.js').ItemPageResponse|null, error: Object|null}>}
		 */
		async getTodos(memberId) {
			return await todoClient.getTodos(memberId);
		},

		/**
		 * 할 일 생성
		 * @param {string} memberId - 멤버 ID
		 * @param {import('./todo.js').CreateItemRequest} taskData - 할 일 데이터 객체
		 * @returns {Promise<{data: import('./todo.js').ItemMainResponse|null, error: Object|null}>}
		 */
		async createTodo(memberId, taskData) {
			return await todoClient.createTodoForMember(memberId, taskData);
		},

		/**
		 * 할 일 업데이트
		 * @param {string} id - 할 일 ID
		 * @param {import('./todo.js').UpdateItemRequest} itemData - 업데이트할 데이터
		 * @returns {Promise<{data: import('./todo.js').ItemMainResponse|null, error: Object|null}>}
		 */
		async updateTodo(id, itemData) {
			return await todoClient.updateTodo(id, itemData);
		}
	};

	return { auth, todo };
}
