import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/utils/auth-guard.js';
import CategoryDetailContextMenu from './CategoryDetailContextMenu.svelte';

export async function load({ parent, params, url }) {
	const { zzic } = await requireAuth(parent, url);
	const { categoryId } = params;

	const { data: category, error: categoryError } = await zzic.category.getCategory({ categoryId });

	if (categoryError) {
		error(500, categoryError.message || '카테고리를 불러올 수 없습니다.');
	}

	return {
		meta: {
			title: category.name,
			description: '분류 상세 페이지입니다.'
		},
		category,
		contextMenu: CategoryDetailContextMenu
	};
}
