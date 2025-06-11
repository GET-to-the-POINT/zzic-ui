import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, locals: { zzic, user }, params }) => {
		const { todoId } = params;
		const formData = await request.formData();
		const title = formData.get('title');
		const description = formData.get('description');
		const done = formData.get('done') === 'true';

		const { error } = await zzic.todo.updateTodo(user.sub, parseInt(todoId), {
			title,
			description,
			done
		});

		if (error) {
			return fail(400, { error: error.message || 'Todo 수정 실패' });
		}
	},

	delete: async ({ locals: { zzic, user }, params }) => {
		const { todoId, nickname } = params;

		const { error } = await zzic.todo.deleteTodo(user.sub, parseInt(todoId));

		if (error) {
			return fail(400, { error: error.message || 'Todo 삭제 실패' });
		}

		throw redirect(303, `/members/${nickname}/todos`);
	}
};
