import { error } from '@sveltejs/kit';

/**
 * @typedef {import('$lib/zzic-api/todo.js').TodoDto} TodoDto
 * @typedef {import('$lib/zzic-api/todo.js').PageTodoDto} PageTodoDto
 * @typedef {import('$lib/zzic-api/challenge.js').ChallengeDto} ChallengeDto
 * @typedef {import('$lib/zzic-api/challenge.js').PageChallengeDto} PageChallengeDto
 */

/**
 * @typedef {Object} LoadParams
 * @property {Function} parent - 부모 레이아웃 데이터 로더
 * @property {Object} params - 라우트 파라미터
 * @property {string} params.nickname - 사용자 닉네임
 * @property {Object} url - URL 객체
 * @property {URLSearchParams} url.searchParams - URL 검색 파라미터
 */

/**
 * @typedef {Object} PageData
 * @property {PageTodoDto} yetTodoPage - 미완료 Todo 페이지 데이터
 * @property {PageTodoDto} doneTodoPage - 완료된 Todo 페이지 데이터
 * @property {PageChallengeDto} challengePage - 챌린지 페이지 데이터
 */

/**
 * 태스크 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} 태스크 페이지 데이터
 */
export async function load({ parent }) {
	const { zzic, user } = await parent();

	try {
		const yetTodoPromise = zzic.todo.getTodos(user.sub, { done: false });
		const doneTodoPromise = zzic.todo.getTodos(user.sub, { done: true });
		const challengesPromise = zzic.challenge.getChallenges({ userId: user.sub }, { enroll: false});

		const results = await Promise.all([yetTodoPromise, doneTodoPromise, challengesPromise]);

		const [{ data: yetTodoPage }, { data: doneTodoPage }, { data: challengePage }] = results;

		return {
			yetTodoPage,
			doneTodoPage,
			challengePage
		};
	} catch (e) {
		console.error('Error loading todos:', e);
		error(500, {
			message: e.message || 'Failed to load todos',
		});
	}
}
