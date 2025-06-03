export async function load({ parent, fetch }) {
	const { zzic, user } = await parent();

	const { data : yetTodoPage, error } = await zzic.todo.getTodos(user.sub);
	const { data : doneTodoPage } = await zzic.todo.getTodos(user.sub, { done : true });

	if (error) {
		console.error('Failed to load todos:', error);
		throw Error('Failed to load todos');
	}

	return { yetTodoPage, doneTodoPage};
}
