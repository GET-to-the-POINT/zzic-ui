import { error } from '@sveltejs/kit';
import TodoDetailContextMenu from './TodoDetailContextMenu.svelte';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const { todoId } = params;
	const { zzic } = await parent();

	const { data: todoData, error: todoError } = await zzic.todo.getTodo({ todoId });
	const { data: categoryData, error: categoryError } = await zzic.category.getCategories();
	const { data: tagData, error: tagError } = await zzic.tag.getTags();
	const { data: priorityData, error: priorityError } = await zzic.priority.getPriorities();

	if (todoError) {
		error(500, `Todo with id ${todoId} not found`);
	} else if (categoryError) {
		error(500, categoryError.detail);
	} else if (tagError) {
		error(500, tagError.detail);
	} else if (priorityError) {
		error(500, priorityError.detail);
	}

	return {
		meta: {
			title: todoData.title,
			description: '할일 상세 페이지입니다.'
		},
		formId: crypto.randomUUID(),
		contextMenu: TodoDetailContextMenu,
		todo: todoData,
		categories: categoryData,
		tags: tagData,
		priorities: priorityData
	};
}
