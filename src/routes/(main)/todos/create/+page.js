import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/utils/auth-guard.js';
import ContextMenu from './CreateContextMenu.svelte';

export async function load({ parent, url }) {
	const { zzic } = await requireAuth(parent, url);

	const [
		{ data: categoryData, error: categoryError },
		{ data: tagData, error: tagError },
		{ data: priorityData, error: priorityError },
		{ data: repeatData, error: repeatError }
	] = await Promise.all([
		zzic.category.getCategories(),
		zzic.tag.getTags(),
		zzic.priority.getPriorities(),
		zzic.repeat.getRepeatTypes()
	]);

	if (categoryError) {
		error(500, categoryError.detail);
	} else if (tagError) {
		error(500, tagError.detail);
	} else if (priorityError) {
		error(500, priorityError.detail);
	} else if (repeatError) {
		error(500, repeatError.detail);
	}

	return {
		meta: {
			title: '할일 생성',
			description: '할일을 생성하는 페이지입니다.',
			modal: true
		},
		formId: crypto.randomUUID(),
		contextMenu: ContextMenu,
		categories: categoryData,
		tags: tagData,
		priorities: priorityData,
		repeatTypes: repeatData
	};
}
