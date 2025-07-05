import { requireAuth } from '$lib/utils/auth-guard.js';
import NoteContextMenu from '../NoteContextMenu.svelte';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url, params }) {
	await requireAuth(parent, url);

	return {
		noteId: params.noteId,
		meta: {
			title: `노트`,
			description: '노트 상세 페이지입니다.'
		},
		contextMenu: NoteContextMenu
	};
}
