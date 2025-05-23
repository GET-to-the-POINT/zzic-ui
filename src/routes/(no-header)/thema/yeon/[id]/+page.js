import { getTodo } from '$lib/todos.js';

export const load = async ({ params, fetch }) => {
	const todoResponse = await fetch(getTodo(params.id));
	if (!todoResponse.ok) {
		throw new Error('Failed to fetch todo');
	}

	const todo = await todoResponse.json();
	return { todo };
};