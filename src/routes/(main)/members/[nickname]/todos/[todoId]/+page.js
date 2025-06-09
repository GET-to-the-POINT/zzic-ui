/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const { todoId } = params;
	const { zzic, user } = await parent();

	// @ts-ignore - zzic.todo client is available from parent layout
	const { data: todo, error } = await zzic.todo.getTodo(user.sub, parseInt(todoId));
	
	if (error || !todo) {
		throw new Error(`Todo with id ${todoId} not found`);
	}

	return {
		todo,
		title: 'Todo Details',
	};
}
