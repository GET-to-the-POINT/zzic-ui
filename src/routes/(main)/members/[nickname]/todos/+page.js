export async function load({ parent }) {
	const { zzic, user } = await parent();

	const yetTodoPromise = zzic.todo.getTodos(user.sub);
	const doneTodoPromise = zzic.todo.getTodos(user.sub, { done : true });

	const [ { data : yetTodoPage }, { data : doneTodoPage } ] = await Promise.all([yetTodoPromise, doneTodoPromise]);

	return { yetTodoPage, doneTodoPage };
}
