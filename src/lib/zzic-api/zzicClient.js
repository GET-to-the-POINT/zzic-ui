import { getUserFromCookies } from '$lib/jwt.js';
import { createChallengeClient } from './challenge.js';
import { createTodoClient } from './todo.js';
import { createAuthClient } from './auth.js';
import { createCategoryClient } from './category.js';
import { createPriorityClient } from './priority.js';
import { createTagClient } from './tag.js';

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

	// 브라우저용 사용자 정보 가져오기 함수
	const getUserFn = () => {
		const cookies = document.cookie;
		const user = getUserFromCookies(/** @type {any} */ (cookies));

		if (!user) {
			return { 
				data: { user: null }, 
				error: { status: 401, message: 'User not authenticated' } 
			};
		}

		// TODO: [BACKEND] 타임존 정보는 현재 하드코딩되어 있음. 백엔드에서 사용자별 타임존 구현 예정
		const userWithTimeZone = {
			...user,
			timeZone: 'Asia/Seoul' // 하드코딩된 타임존 - 추후 백엔드에서 제공 예정
		};

		return { 
			data: { user: /** @type {any} */ (userWithTimeZone) }, 
			error: null 
		};
	};

	const auth = createAuthClient(apiUrl, fetchFn, { getUserFn });
	const todo = createTodoClient(apiUrl, fetchFn);
	const challenge = createChallengeClient(apiUrl, fetchFn);
	const category = createCategoryClient(apiUrl, fetchFn);
	const priority = createPriorityClient(apiUrl, fetchFn);
	const tag = createTagClient(apiUrl, fetchFn);

	return { auth, todo, challenge, category, priority, tag };
}
