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

	return { auth };
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
				const user = getUserFromCookies(cookies);

				if (!user) {
					const response = await fetchFn(`${apiUrl}/auth/refresh`, {
						method: 'GET',
					});
				}

				// 	if (response.ok) {
				// 		const user = getUserFromCookies(cookies);
				// 		if (user) {
				// 			return { data: { user }, error: null };
				// 		}
				// 	}
				// 	return { data: { user: null }, error: { message: 'User not found' } };
				// }
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
						const error = await response.json();
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
		}
	};
}