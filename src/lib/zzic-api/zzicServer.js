import { getUserFromCookies } from '$lib/jwt.js';
import { createTodoClient } from './todo.js';
import { createChallengeClient } from './challenge.js';
import { createAuthClient } from './auth.js';
import { createCategoryClient } from './category.js';
import { createPriorityClient } from './priority.js';
import { createRepeatClient } from './repeat.js';
import { createTagClient } from './tag.js';
import { createMemberClient } from './member.js';

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

	// 서버용 사용자 정보 가져오기 함수
	const getUserFn = () => {
		const user = getUserFromCookies(/** @type {any} */ (cookies));

		if (!user) {
			return {
				data: { user: null },
				error: { status: 401, message: 'User not authenticated' }
			};
		}

		return {
			data: { user },
			error: null
		};
	};

	const auth = createAuthClient(apiUrl, fetchFn, { getUserFn });
	const todo = createTodoClient(apiUrl, fetchFn);
	const challenge = createChallengeClient(apiUrl, fetchFn);
	const category = createCategoryClient(apiUrl, fetchFn);
	const priority = createPriorityClient(apiUrl, fetchFn);
	const repeat = createRepeatClient(apiUrl, fetchFn);
	const tag = createTagClient(apiUrl, fetchFn);
	const member = createMemberClient(apiUrl, fetchFn);

	return { auth, todo, challenge, category, priority, repeat, tag, member };
}
