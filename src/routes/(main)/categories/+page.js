import { error } from '@sveltejs/kit';
import CategoriesContextMenu from './CategoriesContextMenu.svelte';

/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { zzic } = await parent();

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
