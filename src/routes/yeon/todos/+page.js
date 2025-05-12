import {
	get,
} from 'svelte/store';
import { todos as storeTodos}   from '$lib/stores/todos.js';

export const load = async () => {
	const todos = get(storeTodos);

	return { todos };
};