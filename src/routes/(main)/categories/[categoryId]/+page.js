import { error } from '@sveltejs/kit';
import CategoryDetailContextMenu from './CategoryDetailContextMenu.svelte';

export async function load({ parent, params }) {
	const { zzic } = await parent();
	const { categoryId } = params;

	const { data: category, error: categoryError } = await zzic.category.getCategory({ categoryId });

	if (categoryError) {
		error(500, categoryError.message || '카테고리를 불러올 수 없습니다.');
	}

	return {
		category,
		contextMenu: CategoryDetailContextMenu
	};
}
