import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/utils/auth-guard.js';
import CategoriesContextMenu from './CategoriesContextMenu.svelte';

/** @type {import('./$types').PageLoad} */
export async function load({ parent, url }) {
	const { zzic } = await requireAuth(parent, url);

	const { data, error: categoryError } = await zzic.category.getCategories();

	if (categoryError) {
		error(500, categoryError.detail);
	}

	return {
		meta: {
			title: '분류',
			description: '할 일 분류를 추가, 수정, 삭제할 수 있습니다.'
		},
		categories: data,
		contextMenu: CategoriesContextMenu
	};
}
