import { requireAuth } from '$lib/utils/auth-guard.js';
import NotesContextMenu from './NotesContextMenu.svelte';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url }) {
	await requireAuth(parent, url);
	return {
		meta: {
			title: '노트',
			description: '마크다운을 지원하는 노트 작성 및 관리 페이지입니다.'
		},
		contextMenu: NotesContextMenu
	};
}
