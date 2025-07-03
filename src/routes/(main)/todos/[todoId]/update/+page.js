import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/utils/auth-guard.js';
import UpdateContextMenu from './UpdateContextMenu.svelte';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent, url }) {
	const { todoId } = params;
	const { zzic } = await requireAuth(parent, url);

	// 병렬 요청으로 병목 해결
	const [
		{ data: todoData, error: todoError },
		{ data: categoryData, error: categoryError },
		{ data: tagData, error: tagError },
		{ data: priorityData, error: priorityError },
		{ data: repeatData, error: repeatError }
	] = await Promise.all([
		zzic.todo.getTodo({ todoId }),
		zzic.category.getCategories(),
		zzic.tag.getTags(),
		zzic.priority.getPriorities(),
		zzic.repeat.getRepeatTypes()
	]);

	if (todoError) {
		error(500, `Todo with id ${todoId} not found`);
	} else if (categoryError) {
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
			title: todoData.title,
			description: '할일 수정 페이지입니다.',
			modal: true
		},
		formId: crypto.randomUUID(),
		contextMenu: UpdateContextMenu,
		todo: todoData,
		categories: categoryData,
		tags: tagData,
		priorities: priorityData,
		repeatTypes: repeatData
	};
}
