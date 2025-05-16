import { createTodo, getTodo } from '$lib/todos';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		const description = formData.get('description');
		const createTodoCommand = createTodo({ title, description });

		const createdTodoResponse = await fetch(createTodoCommand.url, createTodoCommand.options);
		if (!createdTodoResponse.ok) {
			throw new Error('Failed to create todo');
		}
		const keys = await createdTodoResponse.json();

		const getTodoCommand = getTodo(keys.id);
		const todoResponse = await fetch(getTodoCommand.url, getTodoCommand.options);
		if (!todoResponse.ok) {
			throw new Error('Failed to fetch todo');
		}
		return await todoResponse.json();
	}
};