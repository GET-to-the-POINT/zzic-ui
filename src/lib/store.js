import { writable } from 'svelte/store';

export const todos = writable([
	{ id: 1, title: "Demo 1", description: "설명입니다", done: false },
	{ id: 2, title: "Demo 2", description: "완료된 작업입니다", done: true }
]);
