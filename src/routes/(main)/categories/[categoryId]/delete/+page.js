import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/utils/auth-guard.js';
import DeleteContextMenu from './DeleteContextMenu.svelte';

export async function load({ parent, params, url }) {
	const { zzic } = await requireAuth(parent, url);
	const { categoryId } = params;

	const { data: category, error: categoryError } = await zzic.category.getCategory({ categoryId });

	if (categoryError) {
		error(500, categoryError.message || '카테고리를 불러올 수 없습니다.');
	}

	return {
		meta: {
			title: '카테고리 삭제',
			description: '카테고리를 삭제합니다.',
			modal: true
		},
		category,
		formId: crypto.randomUUID(),
		contextMenu: DeleteContextMenu
	};
}
