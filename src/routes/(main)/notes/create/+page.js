import { requireAuth } from '$lib/utils/auth-guard.js';
import CreateContextMenu from './CreateContextMenu.svelte';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ parent, url }) {
	await requireAuth(parent, url);
	
	return {
		meta: {
			title: '노트 생성',
			description: '새로운 노트를 작성합니다.',
			modal: true
		},
		formId: crypto.randomUUID(),
		contextMenu: CreateContextMenu
	};
}