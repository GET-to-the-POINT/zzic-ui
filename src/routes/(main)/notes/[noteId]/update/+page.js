import { requireAuth } from '$lib/utils/auth-guard.js';
import UpdateContextMenu from './UpdateContextMenu.svelte';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url, params }) {
	await requireAuth(parent, url);
	
	return {
		noteId: params.noteId,
		meta: {
			title: '노트 수정',
			description: '노트를 수정합니다.',
			modal: true
		},
		formId: crypto.randomUUID(),
		contextMenu: UpdateContextMenu
	};
}