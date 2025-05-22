export function load({ params }) {
	const id = Number(params.id);
	const todos = [
		{ id: 1, title: 'Demo 1', description: '설명입니다', done: false },
		{ id: 2, title: 'Demo 2', description: '완료된 작업입니다', done: true }
	];
	const todo = todos.find(t => t.id === id);

	if (!todo) throw error(404, '할 일을 찾을 수 없습니다.');
	return { todo };
}