import { json } from '@sveltejs/kit';

// GET /api/todos
export async function GET({ url }) {
	const done = url.searchParams.get('done') === 'true';
	const todos = [
		{ id: 1, title: 'Demo 1', done: true },
		{ id: 2, title: 'Demo 2', done: false }
	];
	const filtered = todos.filter(todo => todo.done === done);
	return json(filtered);
}

// POST /api/todos
export async function POST({ request }) {
	const { title, description } = await request.json();
	const newTodo = {
		id: Date.now(),
		title,
		description,
		done: false
	};
	// Normally you'd save this somewhere
	return json(newTodo, {
		status: 201,
	});
}