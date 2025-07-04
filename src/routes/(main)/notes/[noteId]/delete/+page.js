import { requireAuth } from '$lib/utils/auth-guard.js';
import DeleteContextMenu from './DeleteContextMenu.svelte';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url, params }) {
	await requireAuth(parent, url);
	
	// 로컬 스토리지에서 노트 정보 가져오기 (실제로는 서버 API 사용)
	let noteTitle = '노트';
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('memo-app-data');
		if (saved) {
			const parsed = JSON.parse(saved);
			const memos = parsed.memos || [];
			const note = memos.find(memo => memo.id === params.noteId);
			if (note) {
				noteTitle = note.title;
			}
		}
	}
	
	return {
		noteId: params.noteId,
		meta: {
			title: noteTitle,
			description: '노트를 삭제합니다.',
			modal: true
		},
		formId: crypto.randomUUID(),
		contextMenu: DeleteContextMenu
	};
}