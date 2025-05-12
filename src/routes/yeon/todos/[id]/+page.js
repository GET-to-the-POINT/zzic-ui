import { get } from 'svelte/store';
import { todos as storeTodos } from '$lib/stores/todos.js';

export const load = async ({ params }) => {
	return {todo : get(storeTodos).find(todo => todo.id === Number(params.id))}
}