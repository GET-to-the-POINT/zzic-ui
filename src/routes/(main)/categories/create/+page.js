import CreateContextMenu from './CreateContextMenu.svelte';

export async function load() {
	return {
		meta: {
			title: '카테고리 생성',
			description: '새로운 카테고리를 생성합니다.',
			modal: true
		},
		formId: crypto.randomUUID(),
		contextMenu: CreateContextMenu
	};
}
