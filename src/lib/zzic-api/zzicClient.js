import { parseJwtPayload } from '$lib/jwt.js';
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
 * 브라우저 클라이언트용 ZZIC 인증 클라이언트
 * @param {string} apiUrl - API 서버 URL
 * @param {Object} [options={}] - 옵션 객체
 * @param {any} [options.global={}] - 글로벌 설정
 * @returns {Object} 브라우저 클라이언트 객체
 */
export function createZzicBrowserClient(apiUrl, options = {}) {
	const { global = {} } = options;
	const fetchFn = /** @type {any} */ (global.fetch) || window.fetch;

	const auth = {
		/**
		 * 현재 사용자 정보 가져오기
		 * @returns {Promise<AuthResponse>}
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

				return { data: { user: /** @type {MemberMeResponse|null} */ (parsedUser) }, error: null };
			} catch (error) {
				console.error('JWT 파싱 실패:', error);
				return { data: { user: null }, error: { message: 'Invalid token format' } };
			}
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
					body: JSON.stringify(credentials),
				});

				if (!response.ok) {
					const error = /** @type {any} */ (await response.json());
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
					method: 'POST',
				});

				return { error: null };
			} catch (error) {
				console.error('로그아웃 실패:', error);
				return { error: /** @type {any} */ (error) };
			}
		},
	};

	// 할 일 팩토리 클라이언트 생성
	const todoClient = createTodoClient(apiUrl, fetchFn);
	const taskList = {
		/**
		 * 목록 조회
		 * @param {string} memberId - 멤버 ID  
		 * @returns {Promise<{data: import('./todo.js').ItemPageResponse|null, error: Object|null}>}
		 */
		async getTodos(memberId) {
			return await todoClient.getTodos(memberId);
		},
		
		/**
		 * 생성
		 * @param {import('./todo.js').CreateItemRequest} taskData - 생성할 할 일 데이터
		 * @returns {Promise<{data: {success: boolean}|null, error: Object|null}>}
		 */
		async createTodo(taskData) {
			return await todoClient.createTodo(taskData);
		},
		
		/**
		 * 업데이트
		 * @param {string} id - 할 일 항목 ID
		 * @param {import('./todo.js').UpdateItemRequest} taskData - 업데이트할 할 일 데이터
		 * @returns {Promise<{data: {success: boolean}|null, error: Object|null}>}
		 */
		async updateTodo(id, taskData) {
			return await todoClient.updateTodo(id, taskData);
		}
	};

	return { auth, todo: taskList };
}
