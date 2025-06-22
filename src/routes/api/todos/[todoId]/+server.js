import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ params, request, locals: { zzic } }) {
	const { todoId } = params;
	const body = await request.json();

	try {
		const { error } = await zzic.todo.updateTodo(parseInt(todoId), body);

		if (error) {
			return json({ error: error.message }, { status: 400 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error updating todo:', error);
		return json({ error: 'Failed to update todo' }, { status: 500 });
	}
}
