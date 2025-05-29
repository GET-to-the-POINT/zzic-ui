import { getUserFromCookies, parseJwtPayload } from '$lib/jwt.js';

/**
 * 브라우저 클라이언트용 ZZIC 인증 클라이언트
 */
export function createZzicBrowserClient(apiUrl, options = {}) {
	const { global = {} } = options;
	const fetchFn = global.fetch || window.fetch;

	const auth = {
		/**
		 * 현재 사용자 정보 가져오기
		 */
		async getUser() {
			const cookiesArray = document.cookie.split(';').map(cookieStr => {
				const indexOfEqualSign = cookieStr.indexOf('=');
				if (indexOfEqualSign === -1) {
					// 값이 없는 쿠키 (예: "myCookie;") -> 이름만 있고 값은 undefined
					return [cookieStr.trim(), undefined];
				}
				const name = cookieStr.substring(0, indexOfEqualSign).trim();
				const value = cookieStr.substring(indexOfEqualSign + 1).trim();
				return [name, value];
			});

			// 'Authorization' 쿠키 찾기
			const authPair = cookiesArray.find(([name]) => name === 'Authorization');

			// 'Authorization' 쿠키가 없거나 값이 없는 경우
			if (!authPair || authPair[1] === undefined) {
				return { data: { user: null }, error: { message: 'Authorization cookie not found or has no value' } };
			}
			
			const token = authPair[1]; // 'Authorization' 쿠키의 값

			try {
				const parsedUser = parseJwtPayload(token); // 토큰으로 사용자 정보 파싱
				// currentUser = parsedUser; // getUser에서 currentUser를 직접 변경하지 않도록 수정

				return { data: { user: parsedUser }, error: null };
			} catch (error) {
				console.error('JWT 파싱 실패:', error);
				return { data: { user: null }, error: { message: 'Invalid token format' } };
			}
		},

		/**
		 * 로그인
		 */
		async signIn(credentials) {
			try {
				const response = await fetchFn(`${apiUrl}/auth/sign-in`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(credentials),
				});

				if (!response.ok) {
					const error = await response.json();
					return { data: { user: null }, error };
				}

				// 로그인 성공 시 서버가 Set-Cookie로 토큰을 설정했다고 가정
				// 새 토큰으로 사용자 정보 가져오기
				const { data: { user: signedInUser }, error: getUserError } = await auth.getUser();
				if (getUserError || !signedInUser) {
					console.error('로그인 후 사용자 정보 가져오기 실패:', getUserError);
					return { data: { user: null }, error: getUserError || { message: 'Failed to retrieve user after sign in'} };
				}

				return { data: { user: signedInUser }, error: null };
			} catch (error) {
				console.error('로그인 실패:', error);
				return { data: { user: null }, error };
			}
		},

		/**
		 * 로그아웃
		 */
		async signOut() {
			try {
				await fetchFn(`${apiUrl}/auth/sign-out`, {
					method: 'POST',
				});

				return { error: null };
			} catch (error) {
				console.error('로그아웃 실패:', error);
				return { error };
			}
		},
	};

			const todo = {
			/**
			 * @param {string} memberId
			 */
			async getTodos(memberId) {
				const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos`); // memberId가 me 로 변경되어야 하지만, 일단 유지. API 문서와 불일치.
				if (!response.ok) {
					const error = await response.json().catch(() => ({}));
					return { data: null, error };
				}
				const data = await response.json();
				return { data, error: null };
			},
			/**
			 * @param {{ title: string, description: string }} todoData
			 */
			async createTodo(todoData) {
				const response = await fetchFn(`${apiUrl}/api/members/me/todos`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(todoData)
				});
				if (response.status !== 201) { // API 문서 기준 201
					const error = await response.json().catch(() => ({ message: 'Failed to create todo' }));
					return { data: null, error };
				}
				// 201 Created 응답은 일반적으로 본문이 없거나, 생성된 리소스의 위치를 반환합니다.
				// API 문서에 따르면 생성된 Todo를 반환하지 않으므로, 성공 여부만 반환하거나, getTodos를 다시 호출해야 합니다.
				// 여기서는 성공 여부만 반환하도록 단순화합니다. 필요시 +page.server.js에서 목록을 다시 로드해야 합니다.
				return { data: { success: true }, error: null };
			},
			/**
			 * @param {string} id
			 * @param {{ title?: string, description?: string, done?: boolean }} todoData
			 */
			async updateTodo(id, todoData) {
				const response = await fetchFn(`${apiUrl}/api/members/me/todos/${id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(todoData)
				});
				if (response.status !== 204) { // API 문서 기준 204
					const error = await response.json().catch(() => ({ message: 'Failed to update todo' }));
					return { data: null, error };
				}
				// 204 No Content 응답은 본문이 없습니다.
				return { data: { success: true }, error: null };
			}
		}

	return { auth, todo };
}

/**
 * 서버 사이드용 ZZIC 인증 클라이언트  
 */
export function createZzicServerClient(apiUrl, options = {}) {
	const { global = {}, cookies } = options;
	const fetchFn = global.fetch || globalThis.fetch;

	return {
		auth: {
			async getUser() {
				let user = getUserFromCookies(cookies);

				if (!user) {
					return { data: { user: null }, error: { message: 'User not authenticated' } };
				}

				return { data: { user }, error: null };
			},

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
						const error = await response.text();
						return { data: { user: null }, error };
					}

					// 서버에서 받은 Set-Cookie 헤더를 안전하게 처리
					try {
						const setCookieHeader = response.headers.get('set-cookie');
						if (setCookieHeader) {
							// 모든 쿠키 속성을 보존하며 파싱
							const cookieEntries = setCookieHeader
								.split(/,(?=\s*[^;=\s]+=)/) // handle multiple cookies, more robust for names with non-word chars
								.map(cookie => {
									const parts = cookie.trim().split(';').map(p => p.trim());
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
							cookies.setAll(cookieEntries);
						}
					} catch (cookieError) {
						console.warn('쿠키 설정 실패:', cookieError);
						// 쿠키 설정 실패해도 계속 진행
					}

					const user = { nickname: 'test'}
					return { data: { user }, error: null };
				} catch (error) {
					console.error('서버 로그인 실패:', error);
					return { data: { user: null }, error };
				}
			},

			async signUp(credentials) {
				const signUpResponse = await fetchFn(`${apiUrl}/auth/sign-up`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(credentials)
				});

				if (!signUpResponse.ok) {
					const error = await signUpResponse.json();
					return { error };
				}

				return { error: null };
			},

			async signOut() {
				try {
					await fetchFn(`${apiUrl}/auth/sign-out`, {
						method: 'POST'
					});

					return { error: null };
				} catch (error) {
					console.error('서버 로그아웃 실패:', error);
					return { error };
				}
			}
		},
		todo: {
			/**
			 * @param {string} memberId
			 */
			async getTodos(memberId) {
				const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos`);
				if (!response.ok) {
					const error = await response.json().catch(() => ({}));
					return { data: null, error };
				}
				const data = await response.json();
				return { data, error: null };
			},
			/**
			 * @param {string} memberId
			 * @param {object} todo
			 */
			async createTodo(memberId, todo) {
				const response = await fetchFn(`${apiUrl}/api/members/${memberId}/todos`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(todo)
				});
				if (!response.ok) {
					const error = await response.json().catch(() => ({}));
					return { data: { todos: [] }, error };
				}
				const todos = await response.json();
				return { data: { todos }, error: null };
			}
		}
	};
}