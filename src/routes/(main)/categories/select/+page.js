import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/utils/auth-guard.js';
import SelectContextMenu from './SelectContextMenu.svelte';

/** @type {import('./$types').PageLoad} */
export async function load({ parent, url }) {
	const { zzic } = await requireAuth(parent, url);

	const { data, error: categoryError } = await zzic.category.getCategories();

	if (categoryError) {
		error(500, {
			message: '분류 로드 실패'
		});
	}

	return {
		meta: {
			title: '분류 선택',
			description: '할 일 분류 선택 페이지입니다.'
		},
		categories: data,
		formId: crypto.randomUUID(),
		contextMenu: SelectContextMenu
	};
}
