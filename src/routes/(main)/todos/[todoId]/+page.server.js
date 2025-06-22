import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, url, locals: { zzic }, params }) => {
		const { todoId } = params;
		const formData = await request.formData();
		// const todoData = Object.fromEntries(formData);

		const { error } = await zzic.todo.updateTodo({ todoId }, formData);

		if (error) {
			return fail(400, { error: error.message || 'Todo 수정 실패' });
		}

		const searchParams = new URLSearchParams(url.search);
		searchParams.delete('/update'); // SvelteKit 액션 파라미터 제거

		const cleanSearch = searchParams.toString();
		const redirectUrl = cleanSearch ? `/todos?${cleanSearch}` : '/todos';

		return redirect(303, redirectUrl);
	},

	delete: async ({ locals: { zzic }, params }) => {
		const { todoId } = params;

		const { error } = await zzic.todo.deleteTodo({ todoId });

		if (error) {
			return fail(400, { error: error.message || 'Todo 삭제 실패' });
		}

		throw redirect(303, `/todos`);
	}
};
