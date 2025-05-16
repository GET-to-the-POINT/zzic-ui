import { deleteTodo } from '$lib/todos.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, locals }) => {
		return;
	},
	delete: async ({ params, locals, fetch, form }) => {
		const id = params.id;
		const deleteTodoCommand = deleteTodo(id);
		const response = await fetch(deleteTodoCommand.url, deleteTodoCommand.options);
		if (!response.ok) {
			throw new Error('Failed to delete todo');
		}
		redirect(304, '/todos');
	},
};