/**
 * @typedef {Object} Task
 * @property {string} id - Task ID
 * @property {string} title - Task 제목
 * @property {string} [description] - Task 설명
 * @property {boolean} done - 완료 여부
 * @property {string} createdAt - 생성 시간
 * @property {string} [updatedAt] - 수정 시간
 */

import { error } from '@sveltejs/kit';

/**
 * @typedef {Object} TaskPage
 * @property {Array<Task>} content - Task 목록
 * @property {number} totalElements - 전체 요소 개수
 * @property {number} totalPages - 전체 페이지 수
 * @property {number} number - 현재 페이지 번호
 * @property {number} size - 페이지 크기
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
 * @typedef {import('$lib/zzic-api/challenge.js').ChallengeDto} Challenge
 */

/**
 * @typedef {import('$lib/zzic-api/challenge.js').PageChallengeDto} ChallengePage
 */

/**
 * @typedef {Object} PageData
 * @property {Array<Task>} yetTodos - 미완료 task 목록
 * @property {Array<Task>} doneTodos - 완료된 task 목록
 * @property {TaskPage} yetTodoPage - 미완료 task 페이지 데이터
 * @property {TaskPage} doneTodoPage - 완료된 task 페이지 데이터
 * @property {Array<Challenge>} challengeList - 챌린지 목록
 * @property {ChallengePage} [challengePage] - 챌린지 페이지 데이터
 */

/**
 * 태스크 페이지 데이터를 로드합니다
 * @param {LoadParams} params - 로드 파라미터
 * @returns {Promise<PageData>} 태스크 페이지 데이터
 */
export async function load({ parent }) {
	const { zzic, user } = await parent();

	try {
		const yetTaskPromise = zzic.todo.getTodos(user.sub, { done: false });
		const doneTaskPromise = zzic.todo.getTodos(user.sub, { done: true });
		const challengesPromise = zzic.challenge.getChallenges();

		const results = await Promise.all([yetTaskPromise, doneTaskPromise, challengesPromise]);

		const [{ data: yetTaskPage }, { data: doneTaskPage }, { data: challengePage }] = results;

		// 배열로 추출하여 반환
		const yetTasks = yetTaskPage?.content || [];
		const doneTasks = doneTaskPage?.content || [];
		const challengeList = challengePage?.content || [];

		return {
			yetTodos: yetTasks,
			doneTodos: doneTasks,
			yetTodoPage: yetTaskPage,
			doneTodoPage: doneTaskPage,
			challengeList,
			challengePage
		};
	} catch (e) {
		console.error('Error loading todos:', e);
		error(500, {
			message: e.message || 'Failed to load todos',
		});
	}
}
