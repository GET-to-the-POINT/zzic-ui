export function load({ params }) {
	const todos = [
		{ id: 1, title: 'Demo 1', description: '설명입니다', done: false },
		{ id: 2, title: 'Demo 2', description: '설명입니다', done: true }
	];

	const id = Number(params.id);
	const todo = todos.find((t) => t.id === id);

	if (!todo) {
		throw error(404, 'Todo not found');
	}

	return { todo };
}