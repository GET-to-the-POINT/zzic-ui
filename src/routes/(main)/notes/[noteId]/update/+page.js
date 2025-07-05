import { requireAuth } from '$lib/utils/auth-guard.js';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import UpdateContextMenu from './UpdateContextMenu.svelte';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url, params }) {
	await requireAuth(parent, url);

	const { noteId } = params;

	// 로컬 스토리지 키
	const STORAGE_KEY = 'memo-app-data';

	// 브라우저 환경이 아닌 경우 빈 데이터 반환 (SSR)
	if (!browser) {
		return {
			noteId,
			memo: null,
			meta: {
				title: '노트 수정',
				description: '노트를 수정합니다.',
				modal: true
			},
			formId: crypto.randomUUID(),
			contextMenu: UpdateContextMenu
		};
	}

	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) {
			throw error(404, {
				message: '메모 데이터를 찾을 수 없습니다'
			});
		}

		const parsed = JSON.parse(saved);
		const memos = parsed.memos || [];

		// Date 객체 복원
		const restoredMemos = memos.map((/** @type {any} */ memo) => ({
			...memo,
			createdAt: new Date(memo.createdAt),
			updatedAt: new Date(memo.updatedAt)
		}));

		// 현재 메모 찾기
		const currentMemo = restoredMemos.find((/** @type {any} */ memo) => memo.id === noteId);

		if (!currentMemo) {
			throw error(404, {
				message: '요청한 메모를 찾을 수 없습니다'
			});
		}

		return {
			noteId,
			memo: currentMemo,
			meta: {
				title: `노트 수정 - ${currentMemo.title}`,
				description: '노트를 수정합니다.',
				modal: true
			},
			formId: crypto.randomUUID(),
			contextMenu: UpdateContextMenu
		};
	} catch (err) {
		// 이미 SvelteKit 에러인 경우 그대로 던지기
		if (/** @type {any} */ (err).status) {
			throw err;
		}

		// 일반 에러인 경우 500 에러로 변환
		console.error('메모 데이터 로드 실패:', err);
		throw error(500, {
			message: '메모 데이터 로드 중 오류가 발생했습니다'
		});
	}
}
