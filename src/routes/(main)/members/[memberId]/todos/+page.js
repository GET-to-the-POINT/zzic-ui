export async function load({ fetch, parent, params }) {
	const { zzic } = await parent();

	const { data, error } = await zzic.todo.getTodos(params.memberId);

	if (error) {
		console.error('Failed to load todos:', error);
		throw Error('Failed to load todos');
	}

	return { todos: data };
}

