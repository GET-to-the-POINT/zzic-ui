// +page.server.js

let todos = [
	{ id: 1, title: 'Demo 1', description: '설명', done: false },
	{ id: 2, title: 'Demo 2', description: '설명', done: true }
];

export function load() {
	return {
		yetTodos: todos.filter((t) => !t.done),
		dones: todos.filter((t) => t.done)
	};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title');
		const newTodo = {
			id: Date.now(),
			title,
			description: '',
			done: false
		};
		todos.push(newTodo);
		return { success: true };
	},
	done: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		todos = todos.map((t) => (t.id === id ? { ...t, done: true } : t));
		return { success: true };
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		todos = todos.filter((t) => t.id !== id);
		throw redirect(303, '/'); // 303 is more correct for POST redirect
	}
};