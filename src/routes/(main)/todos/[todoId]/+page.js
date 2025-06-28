import { error } from '@sveltejs/kit';
import TodoDetailContextMenu from './TodoDetailContextMenu.svelte';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const { todoId } = params;
	const { zzic } = await parent();

	const { data, error: todoError } = await zzic.todo.getTodo({ todoId });

	if (todoError) {
		error(500, `Todo with id ${todoId} not found`);
	}

	return {
		meta: {
			title: data.title,
			description: '할일 상세 페이지입니다.',
		},
		todo: data,
		formId: crypto.randomUUID(),
		contextMenu: TodoDetailContextMenu,
	};
}
