export async function load({ parent, fetch }) {
	const { zzic, user } = await parent();

	const { data, error } = await zzic.todo.getTodos(user.sub);

	if (error) {
		console.error('Failed to load todos:', error);
		throw Error('Failed to load todos');
	}

	return { todoPage: data };
}
