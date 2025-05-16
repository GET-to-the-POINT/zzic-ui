import { getTodos } from '$lib/todos.js';

export const load = async ({fetch}) => {
	const yetToDoResponse = await fetch(getTodos(true));
	const doneResponse = await fetch(getTodos(false));

	if (!doneResponse.ok || !yetToDoResponse.ok) {
		throw new Error('Failed to fetch todos');
	}

	const [ yetTodos, doneTodos ] = await Promise.all([
		yetToDoResponse.json(),
		doneResponse.json()
	]);
	return { yetTodos, doneTodos };
};